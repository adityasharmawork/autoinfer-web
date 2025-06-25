import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, inputData } = body

    let schemaData

    // Handle database sources using your original parsers (server-side only)
    switch (source) {
      case "mongodb":
        const { parseMongoDbCollection } = await import("@/parsers/mongodb")
        const { dbConnectionString, dbName: mongoDbName, collectionName } = inputData
        if (!dbConnectionString || !mongoDbName || !collectionName) {
          return NextResponse.json(
            { error: "MongoDB connection requires connection string, database name, and collection name" },
            { status: 400 },
          )
        }
        schemaData = await parseMongoDbCollection(dbConnectionString, mongoDbName, collectionName)
        break

      case "mysql":
      case "postgresql":
        const { parseSqlTable } = await import("@/parsers/sql")
        const { dbConnectionString: connectionString, dbName, collectionName: tableName, dbSchema } = inputData
        if (!connectionString || !tableName) {
          return NextResponse.json(
            { error: `${source} connection requires connection string and table name` },
            { status: 400 },
          )
        }
        schemaData = await parseSqlTable(source, connectionString, tableName, dbSchema || dbName)
        break

      default:
        return NextResponse.json({ error: `Unsupported database source: ${source}` }, { status: 400 })
    }

    // Return the schema data for client-side processing
    return NextResponse.json({ schema: schemaData })
  } catch (error: any) {
    console.error("Schema generation error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate schema" }, { status: 500 })
  }
}
