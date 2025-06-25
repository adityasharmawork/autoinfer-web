// parsers/mongodb.ts
import { MongoClient, ObjectId as MongoObjectId } from "mongodb"
import { inferSchema, type SchemaType } from "../utils/inferSchema"

const MAX_SAMPLE_SIZE = 100

// Helper function to recursively convert ObjectIds to strings
function convertObjectIdsToStrings(data: any): any {
  if (data instanceof MongoObjectId) {
    return data.toString()
  }
  if (Array.isArray(data)) {
    return data.map(convertObjectIdsToStrings)
  }
  if (data !== null && typeof data === "object" && !(data instanceof Date)) {
    const res: { [key: string]: any } = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        res[key] = convertObjectIdsToStrings(data[key])
      }
    }
    return res
  }
  return data
}

export async function parseMongoDbCollection(
  connectionString: string,
  dbName: string,
  collectionName: string,
): Promise<SchemaType> {
  let client: MongoClient | undefined
  try {
    client = new MongoClient(connectionString)
    await client.connect()
    const db = client.db(dbName)

    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray()
    if (collections.length === 0) {
      throw new Error(
        `Collection '${collectionName}' not found in database '${dbName}'. Check if both Collection Name and Database name are correct.`,
      )
    }

    const collection = db.collection(collectionName)
    const sampleDocs = await collection.find().limit(MAX_SAMPLE_SIZE).toArray()

    if (sampleDocs.length === 0) {
      console.warn(`MongoDB collection '${collectionName}' is empty. Returning a generic empty object schema.`)
      return { type: "object", properties: {}, required: [] }
    }

    // Convert ObjectIds to strings for consistent processing
    const processedDocs = sampleDocs.map((doc) => convertObjectIdsToStrings(doc))

    return inferSchema(processedDocs)
  } catch (error: any) {
    // Preserve specific error from collection check, otherwise create a general one
    if (error.message.startsWith("Collection '") && error.message.includes("' not found in database '")) {
      throw error
    }
    throw new Error(`Failed to parse MongoDB collection '${collectionName}': ${error.message}`)
  } finally {
    if (client) {
      await client.close()
    }
  }
}
