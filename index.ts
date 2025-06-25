#!/usr/bin/env node


import * as fs from 'fs';
import * as path from 'path';

// Parsers & Generators
import { parseJsonFile, parseJsonString } from './parsers/json';
import { parseApiResponse } from './parsers/api';
import { parseCsvFile } from './parsers/csv';
// --- New Parser Imports ---
import { parseMongoDbCollection } from './parsers/mongodb'; // Create this file
import { parseSqlTable } from './parsers/sql'; // Create this file

import { generateTypeScript, GenerateOptions as TSGenerateOptions } from './generators/typescript';
import { generateJsonSchema, GenerateOptions as JsonSchemaGenerateOptions } from './generators/jsonSchema';
import { SchemaType } from './utils/inferSchema';


interface CustomField {
  name: string;
  type: string; // e.g., 'string', 'number', 'array_string', 'array_object'
}

interface GenerationOptions {
  source: 'api' | 'json' | 'csv' | 'mongodb' | 'mysql' | 'postgresql'; // Added new sources
  url?: string; // For API
  file?: string; // For JSON, CSV
  jsonInput?: string; // For direct JSON input for CLI
  output: 'typescript' | 'jsonschema';
  interfaceName: string;
  inferOptional: boolean;
  prettify: boolean;
  outFile?: string;
  customFields?: CustomField[];
  verbose?: boolean;

  // --- Database Specific Options ---
  dbConnectionString?: string;
  dbName?: string; // For MongoDB
  collectionName?: string; // For MongoDB
  dbSchema?: string; // For SQL (e.g., 'public' in PostgreSQL, or database name in MySQL)
  tableName?: string; // For SQL
}


function dedupeUnions(text: string, format: 'typescript' | 'jsonschema', prettify: boolean): string {
  if (format === 'typescript') {
    let dedupedText = text;
    let previousText = "";
    do {
        previousText = dedupedText;
        dedupedText = dedupedText.replace(/(\b\w+(?:\[\])?\b)\s*\|\s*\1(?!\w)/g, '$1');
        // Sort union members alphabetically for consistent output
        dedupedText = dedupedText.replace(/(\b\w+(?:\[\])?\b)\s*\|\s*(\b\w+(?:\[\])?\b)/g, (match, p1, p2) => {
            const types = [p1, p2].sort((a, b) => a.localeCompare(b));
            return types.join(' | ');
        });
        // Second pass to ensure deduplication after sorting if types became adjacent
        dedupedText = dedupedText.replace(/(\b\w+(?:\[\])?\b)\s*\|\s*\1(?!\w)/g, '$1'); 
    } while (previousText !== dedupedText);
    return dedupedText;
  }
  // For JSON Schema
  try {
    const obj = JSON.parse(text);
    function walk(node: any) {
      if (node && typeof node === 'object') {
        if (Array.isArray(node.anyOf)) {
          const seen = new Set<string>();
          // Sort before filtering to make deduplication consistent
          node.anyOf.sort((a: any, b: any) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
          node.anyOf = node.anyOf.filter((sub: any) => {
            const key = JSON.stringify(sub); // Key for deduplication
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          if (node.anyOf.length === 1) {
            Object.assign(node, node.anyOf[0]);
            delete node.anyOf;
          } else if (node.anyOf.length === 0) {
            // If all union members were duplicates and removed, what should it be?
            // Maybe a generic object or a specific type indicating an issue.
            // For now, let's remove 'anyOf' or set to a default.
            delete node.anyOf;
            node.description = node.description || "Empty union after deduplication";
          }
        }
        Object.values(node).forEach(walk);
      }
    }
    walk(obj);
    return JSON.stringify(obj, null, prettify ? 2 : undefined);
  } catch (e) {
    // If parsing fails, return original text
    console.warn(("Could not deduplicate JSON schema unions due to a parsing error.");
    return text;
  }
}

async function processGeneration(opts: GenerationOptions) {
  spinner.update({text: `Processing ${opts.source}...`});
  let data: SchemaType;
  try {
    switch (opts.source) {
      case 'json':
        if (opts.jsonInput && !opts.file) {
          data = parseJsonString(opts.jsonInput);
        } else if (opts.file) {
          data = await parseJsonFile(opts.file);
        } else {
          throw new Error('JSON source selected but no input data / file was provided.');
        }
        break;
      case 'api':
        if (!opts.url) throw new Error('API source selected but no URL was provided.');
        data = await parseApiResponse(opts.url);
        break;
      case 'csv':
        if (!opts.file) throw new Error('CSV source selected but no file path was provided.');
        data = await parseCsvFile(opts.file);
        break;
      // --- New Database Cases ---
      case 'mongodb':
        if (!opts.dbConnectionString || !opts.dbName || !opts.collectionName) {
          throw new Error('MongoDB source requires connection string, database name, and collection name.');
        }
        spinner.update({text: `Connecting to MongoDB and fetching data from ${opts.collectionName}...`});
        data = await parseMongoDbCollection(opts.dbConnectionString, opts.dbName, opts.collectionName);
        break;
      case 'mysql':
      case 'postgresql':
        if (!opts.dbConnectionString || !opts.tableName) {
          throw new Error(`${opts.source} source requires connection string and table name.`);
        }
        spinner.update({text: `Connecting to ${opts.source} and fetching schema for table ${opts.tableName}...`});
        data = await parseSqlTable(opts.source, opts.dbConnectionString, opts.tableName, opts.dbSchema);
        break;
      default:
        // This check is for type safety, but the input should be validated before this.
        // To satisfy TypeScript, we can cast `opts.source` or ensure all paths return.
        const exhaustiveCheck: never = opts.source; 
        throw new Error(`Invalid data source: ${exhaustiveCheck}`);
    }

    spinner.update({text: 'Applying custom fields...'});
    if (opts.customFields && opts.customFields.length > 0) {
      if (data.type !== 'object') {
        console.warn(chalk.yellow("\nCustom fields can only be added to an object-based schema. Current base schema is not an object. Ignoring custom fields."));
      } else {
        if (!data.properties) {
          data.properties = {};
        }
        opts.customFields.forEach(field => {
          let fieldSchemaType: SchemaType;
          if (field.type.startsWith('array_')) {
              const itemTypeString = field.type.split('_')[1];
              let itemSchema: SchemaType;
              if (itemTypeString === 'object') {
                itemSchema = { type: 'object', properties: {} }; // Array of generic objects
              } else {
                itemSchema = { type: itemTypeString } as SchemaType; // Array of primitives
              }
              fieldSchemaType = { type: 'array', items: itemSchema };
          } else if (field.type === 'object') {
              fieldSchemaType = { type: 'object', properties: {} }; // Generic object
          } else {
            fieldSchemaType = { type: field.type } as SchemaType; // Primitive
          }
          data.properties![field.name] = fieldSchemaType;
          // If inferOptional is false, all fields (including custom) should ideally be required
          // unless explicitly marked. For simplicity, custom fields are not added to 'required' by default here.
        });
      }
    }
    
    spinner.update({text: `Generating ${opts.output}...`});
    let outputText = '';
    const generatorOptions = {
      inferOptional: opts.inferOptional,
      interfaceName: opts.interfaceName,
      prettify: opts.prettify,
    };

    if (opts.output === 'typescript') {
      outputText = await generateTypeScript(data, generatorOptions as TSGenerateOptions);
    } else {
      outputText = generateJsonSchema(data, generatorOptions as JsonSchemaGenerateOptions);
    }
    
    spinner.update({text: 'Deduplicating unions...'});
    outputText = dedupeUnions(outputText, opts.output, opts.prettify);

    spinner.success({ text: `Output generated!` });
    if (opts.outFile) {
      const dirName = path.dirname(opts.outFile);
      if (dirName && dirName !== '.') {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.writeFileSync(opts.outFile, outputText, 'utf-8');
      console.log(chalk.green(`\nOutput successfully written to ${opts.outFile}`));
    } else {
      console.log(`\n${outputText}`);
    }

  } catch (error: any) {
    spinner.error({ text: `Failed to generate output!` });
    console.error(chalk.red(`\nError during processing:`));
    console.error(chalk.red(`  Message: ${error.message}`));
    if (opts.verbose && error.stack) {
      console.error(chalk.grey(error.stack));
    }
    // No longer throwing error here to allow CLI to exit gracefully if called from program.parse
    // throw error; 
    process.exitCode = 1; // Set exit code to indicate failure
  }
}

async function runInteractive() {
  console.log(chalk.bold.cyan('Welcome to AutoInfer - Interactive Mode'));
  const opts: Partial<GenerationOptions> = {};

  try {
    const { sourceChoice } = await inquirer.prompt<{ sourceChoice: 'API' | 'JSON' | 'CSV' | 'MongoDB' | 'PostgreSQL' | 'MySQL' }>([
        {
            type: 'list',
            name: 'sourceChoice',
            message: 'Select data source type:',
            choices: ['API', 'JSON', 'CSV', 'MongoDB', 'PostgreSQL', 'MySQL']
        }
    ]);
    opts.source = sourceChoice.toLowerCase() as GenerationOptions['source'];

    if (opts.source === 'json') {
      const { file } = await inquirer.prompt<{ file: string }>([
          { type: 'input', name: 'file', message: 'Enter JSON file path:', validate: (input: string) => input.trim() !== '' || 'File path cannot be empty.' }
      ]);
      opts.file = file;
    } else if (opts.source === 'api') {
      const { url } = await inquirer.prompt<{ url: string }>([
          { type: 'input', name: 'url', message: 'Enter API endpoint URL:', validate: (input: string) => input.trim() !== '' || 'API URL cannot be empty.' }
      ]);
      opts.url = url;
    } else if (opts.source === 'csv') {
      const { file } = await inquirer.prompt<{ file: string }>([
          { type: 'input', name: 'file', message: 'Enter CSV file path:', validate: (input: string) => input.trim() !== '' || 'File path cannot be empty.' }
      ]);
      opts.file = file;
    } else if (opts.source === 'mongodb') {
      const dbOpts = await inquirer.prompt<Pick<GenerationOptions, 'dbConnectionString' | 'dbName' | 'collectionName'>>([
        { type: 'input', name: 'dbConnectionString', message: 'Enter MongoDB connection string (e.g., mongodb://localhost:27017):', validate: input => input.trim() !== '' || 'Connection string cannot be empty.' },
        { type: 'input', name: 'dbName', message: 'Enter database name:', validate: input => input.trim() !== '' || 'Database name cannot be empty.' },
        { type: 'input', name: 'collectionName', message: 'Enter collection name:', validate: input => input.trim() !== '' || 'Collection name cannot be empty.' }
      ]);
      opts.dbConnectionString = dbOpts.dbConnectionString;
      opts.dbName = dbOpts.dbName;
      opts.collectionName = dbOpts.collectionName;
    } else if (opts.source === 'mysql' || opts.source === 'postgresql') {
      const dbOpts = await inquirer.prompt<Pick<GenerationOptions, 'dbConnectionString' | 'tableName' | 'dbSchema'>>([
        { type: 'input', name: 'dbConnectionString', message: `Enter ${sourceChoice} connection string (e.g., postgresql://user:pass@host:port/dbname or mysql://user:pass@host:port/dbname):`, validate: input => input.trim() !== '' || 'Connection string cannot be empty.' },
        { type: 'input', name: 'tableName', message: 'Enter table name:', validate: input => input.trim() !== '' || 'Table name cannot be empty.' },
        { type: 'input', name: 'dbSchema', message: `Enter schema name (e.g., public for PostgreSQL, or your database name for MySQL if tables aren't qualified by it in the connection string). Leave empty if not applicable:`, default: opts.source === 'postgresql' ? 'public' : ''}
      ]);
      opts.dbConnectionString = dbOpts.dbConnectionString;
      opts.tableName = dbOpts.tableName;
      opts.dbSchema = dbOpts.dbSchema;
    }

    const { outputChoice } = await inquirer.prompt<{ outputChoice: 'TypeScript' | 'JSONSchema' }>([
        { type: 'list', name: 'outputChoice', message: 'Select output format:', choices: ['TypeScript', 'JSONSchema'] }
    ]);
    opts.output = outputChoice.toLowerCase() as 'typescript' | 'jsonschema';

    const { interfaceName } = await inquirer.prompt<{ interfaceName: string }>([
        { type: 'input', name: 'interfaceName', message: opts.output === 'typescript' ? 'Interface name:' : 'Schema title:', default: 'Generated' }
    ]);
    opts.interfaceName = interfaceName;

    const { inferOptionalChoice } = await inquirer.prompt<{ inferOptionalChoice: 'Yes' | 'No' }>([
        { type: 'list', name: 'inferOptionalChoice', message: 'Infer optional properties (fields not present in all objects/samples become optional)?', choices: ['Yes', 'No'], default: (opts.source === 'mysql' || opts.source === 'postgresql') ? 'No' : 'Yes' } // Default No for SQL
    ]);
    opts.inferOptional = inferOptionalChoice === 'Yes';

    const { addCustomFieldsChoice } = await inquirer.prompt<{ addCustomFieldsChoice: 'Yes' | 'No' }>([
        { type: 'list', name: 'addCustomFieldsChoice', message: 'Define additional custom fields?', choices: ['Yes', 'No'], default: 'No' }
    ]);

    if (addCustomFieldsChoice === 'Yes') {
      const { numFields } = await inquirer.prompt<{ numFields: number }>([
          { type: 'input', name: 'numFields', message: 'How many additional fields?', validate: (input: string) => { const num = parseInt(input, 10); return (!isNaN(num) && num > 0) || 'Please enter a positive number.'; }, filter: (input: string) => parseInt(input, 10) }
      ]);
      opts.customFields = [];
      // Added 'array_object' to the list
      const availableTypes = ['string', 'number', 'boolean', 'object', 'array_string', 'array_number', 'array_boolean', 'array_object'];
      for (let i = 0; i < numFields; i++) {
          const { fieldName } = await inquirer.prompt<{ fieldName: string }>([
              { type: 'input', name: 'fieldName', message: `Name for additional field ${i + 1}:`, validate: (input: string) => input.trim() !== '' || 'Field name cannot be empty.' }
          ]);
          const { fieldType } = await inquirer.prompt<{ fieldType: string }>([
              { type: 'list', name: 'fieldType', message: `Data type for field '${fieldName}':`, choices: availableTypes, loop: false }
          ]);
          opts.customFields.push({ name: fieldName, type: fieldType });
      }
    }

    const { prettifyChoice } = await inquirer.prompt<{ prettifyChoice: 'Yes' | 'No' }> ([
        { type: 'list', name: 'prettifyChoice', message: 'Prettify output?', choices: ['Yes', 'No'], default: 'Yes' }
    ]);
    opts.prettify = prettifyChoice === 'Yes';

    const { wantFile } = await inquirer.prompt<{ wantFile: 'Yes' | 'No' }> ([
        { type: 'list', name: 'wantFile', message: 'Save to a file?', choices: ['Yes', 'No'], default: 'No' }
    ]);
    if (wantFile === 'Yes') {
      const { outFile } = await inquirer.prompt<{ outFile: string }> ([
          { type: 'input', name: 'outFile', message: 'Output file path:', validate: (input: string) => input.trim() !== '' || 'Output file path cannot be empty.' }
      ]);
      opts.outFile = outFile;
    }

    await processGeneration(opts as GenerationOptions);

  } catch (error: any) {
    // Check if it's an Inquirer specific error (e.g., user pressed Ctrl+C)
    if (error.isTtyError) {
        console.log(chalk.yellow('\nInteractive mode cancelled.'));
    } else {
        console.error(chalk.red(`\nAn unexpected error occurred in interactive mode:`));
        console.error(chalk.red(`  Message: ${error.message}`));
        if (opts.verbose && error.stack) {
          console.error(chalk.grey(error.stack));
        }
        console.log(chalk.yellow('\nExiting interactive mode due to error.'));
    }
    process.exit(1); // Exit in case of any error in interactive mode
  }
}
