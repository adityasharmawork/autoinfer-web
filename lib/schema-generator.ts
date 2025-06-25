import { inferSchema, type SchemaType } from "@/utils/inferSchema"
import { generateTypeScript } from "@/generators/typescript"
import { generateJsonSchema } from "@/generators/jsonSchema"

interface GenerationData {
  source: "api" | "json" | "csv" | "mongodb" | "mysql" | "postgresql"
  inputData: any
  outputType: "typescript" | "jsonschema"
  options: {
    interfaceName: string
    inferOptional: boolean
    prettify: boolean
  }
}

export async function generateSchema(data: GenerationData): Promise<string> {
  let schemaData: SchemaType

  // Process input data based on source type
  switch (data.source) {
    case "api":
      schemaData = await processApiData(data.inputData)
      break
    case "json":
      schemaData = processJsonData(data.inputData)
      break
    case "csv":
      schemaData = processCsvData(data.inputData)
      break
    case "mongodb":
    case "mysql":
    case "postgresql":
      // Use backend API for database connections (server-side only)
      schemaData = await processDatabaseData(data.source, data.inputData)
      break
    default:
      throw new Error(`Unsupported data source: ${data.source}`)
  }

  // Generate output based on type
  const generatorOptions = {
    inferOptional: data.options.inferOptional,
    interfaceName: data.options.interfaceName,
    prettify: data.options.prettify,
  }

  if (data.outputType === "typescript") {
    return await generateTypeScript(schemaData, generatorOptions)
  } else {
    return generateJsonSchema(schemaData, generatorOptions)
  }
}

async function processApiData(inputData: any): Promise<SchemaType> {
  const { url, method = "GET", headers, body } = inputData

  if (!url) {
    throw new Error("API URL is required")
  }

  try {
    const requestOptions: RequestInit = {
      method,
      headers: headers ? JSON.parse(headers) : undefined,
      body: (method === "POST" || method === "PUT") && body ? body : undefined,
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    return inferSchema(responseData)
  } catch (error) {
    throw new Error(`Failed to fetch API data: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function processJsonData(inputData: any): SchemaType {
  const { jsonText, fileContent } = inputData
  const jsonString = jsonText || fileContent

  if (!jsonString) {
    throw new Error("JSON data is required")
  }

  try {
    const data = JSON.parse(jsonString)
    return inferSchema(data)
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function processCsvData(inputData: any): SchemaType {
  const { csvText, fileContent } = inputData
  const csvString = csvText || fileContent

  if (!csvString) {
    throw new Error("CSV data is required")
  }

  try {
    // Parse CSV data
    const lines = csvString.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header row and one data row")
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: Record<string, any> = {}

      headers.forEach((header, index) => {
        const value = values[index] || ""
        // Convert values to appropriate types
        if (value !== null && value.trim() !== "" && !isNaN(Number(value))) {
          row[header] = Number(value)
        } else if (value && value.toLowerCase() === "true") {
          row[header] = true
        } else if (value && value.toLowerCase() === "false") {
          row[header] = false
        } else {
          row[header] = value
        }
      })

      return row
    })

    return inferSchema(rows)
  } catch (error) {
    throw new Error(`Failed to parse CSV data: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function processDatabaseData(source: "mongodb" | "mysql" | "postgresql", inputData: any): Promise<SchemaType> {
  try {
    const response = await fetch("/api/generate-schema", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source,
        inputData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Database connection failed`)
    }

    const data = await response.json()
    return data.schema // Return the schema data, not the generated output
  } catch (error) {
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}
