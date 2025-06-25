"use client"

import { Card } from "@/components/ui/card"
import { Globe, FileText, Braces, Database, Server, Layers } from "lucide-react"

type DataSource = "api" | "json" | "csv" | "mongodb" | "mysql" | "postgresql"

interface DataSourceSelectorProps {
  selected: DataSource | null
  onSelect: (source: DataSource) => void
}

const dataSources = [
  {
    id: "api" as DataSource,
    icon: Globe,
    title: "API Endpoint",
    description: "Fetch data from REST API endpoints",
    color: "text-blue-400",
    borderColor: "border-blue-500/50",
  },
  {
    id: "json" as DataSource,
    icon: Braces,
    title: "JSON Data",
    description: "Paste JSON data or upload JSON files",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/50",
  },
  {
    id: "csv" as DataSource,
    icon: FileText,
    title: "CSV Data",
    description: "Upload CSV files or paste CSV data",
    color: "text-green-400",
    borderColor: "border-green-500/50",
  },
  {
    id: "mongodb" as DataSource,
    icon: Database,
    title: "MongoDB",
    description: "Connect to MongoDB collections",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/50",
  },
  {
    id: "mysql" as DataSource,
    icon: Server,
    title: "MySQL",
    description: "Connect to MySQL database tables",
    color: "text-orange-400",
    borderColor: "border-orange-500/50",
  },
  {
    id: "postgresql" as DataSource,
    icon: Layers,
    title: "PostgreSQL",
    description: "Connect to PostgreSQL database tables",
    color: "text-purple-400",
    borderColor: "border-purple-500/50",
  },
]

export function DataSourceSelector({ selected, onSelect }: DataSourceSelectorProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Data Source</h3>
        <p className="text-slate-400">Select the type of data you want to generate schemas from</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <Card
            key={source.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selected === source.id
                ? `bg-slate-800 border-2 ${source.borderColor} shadow-lg`
                : "bg-slate-900/50 border-slate-700 hover:bg-slate-800/50"
            }`}
            onClick={() => onSelect(source.id)}
          >
            <div className="p-6 text-center">
              <div className={`inline-flex p-4 rounded-full bg-slate-800 mb-4 ${source.color}`}>
                <source.icon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{source.title}</h4>
              <p className="text-slate-400 text-sm">{source.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
