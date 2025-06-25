"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, FileText, AlertCircle } from "lucide-react"

type DataSource = "api" | "json" | "csv" | "mongodb" | "mysql" | "postgresql"

interface DataInputFormProps {
  source: DataSource
  data: any
  onDataChange: (data: any) => void
}

export function DataInputForm({ source, data, onDataChange }: DataInputFormProps) {
  const [formData, setFormData] = useState(data || {})
  const [error, setError] = useState<string>("")

  const updateFormData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onDataChange(newData)
    setError("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        updateFormData("fileContent", content)
      }
      reader.readAsText(file)
    }
  }

  const validateJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      setError("Invalid JSON format")
      return false
    }
  }

  const renderApiForm = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="url" className="text-white">
          API Endpoint URL *
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://api.example.com/data"
          value={formData.url || ""}
          onChange={(e) => updateFormData("url", e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-2"
        />
      </div>

      <div>
        <Label htmlFor="method" className="text-white">
          HTTP Method
        </Label>
        <select
          id="method"
          value={formData.method || "GET"}
          onChange={(e) => updateFormData("method", e.target.value)}
          className="w-full mt-2 p-3 bg-slate-800 border border-slate-600 rounded-md text-white"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <Label htmlFor="headers" className="text-white">
          Headers (JSON format)
        </Label>
        <Textarea
          id="headers"
          placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
          value={formData.headers || ""}
          onChange={(e) => updateFormData("headers", e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-2 h-24"
        />
      </div>

      {(formData.method === "POST" || formData.method === "PUT") && (
        <div>
          <Label htmlFor="body" className="text-white">
            Request Body (JSON format)
          </Label>
          <Textarea
            id="body"
            placeholder='{"key": "value"}'
            value={formData.body || ""}
            onChange={(e) => updateFormData("body", e.target.value)}
            className="bg-slate-800 border-slate-600 text-white mt-2 h-32"
          />
        </div>
      )}
    </div>
  )

  const renderJsonForm = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-white">JSON Data Input</Label>
        <div className="mt-2 space-y-4">
          <div>
            <Label htmlFor="json-file" className="text-slate-300 text-sm">
              Upload JSON File
            </Label>
            <div className="mt-1 flex items-center space-x-4">
              <Input
                id="json-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="text-center text-slate-400">or</div>

          <div>
            <Label htmlFor="json-text" className="text-slate-300 text-sm">
              Paste JSON Data
            </Label>
            <Textarea
              id="json-text"
              placeholder='{"name": "John", "age": 30, "email": "john@example.com"}'
              value={formData.jsonText || formData.fileContent || ""}
              onChange={(e) => {
                const value = e.target.value
                updateFormData("jsonText", value)
                if (value) validateJson(value)
              }}
              className="bg-slate-800 border-slate-600 text-white mt-1 h-48 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderCsvForm = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-white">CSV Data Input</Label>
        <div className="mt-2 space-y-4">
          <div>
            <Label htmlFor="csv-file" className="text-slate-300 text-sm">
              Upload CSV File
            </Label>
            <div className="mt-1 flex items-center space-x-4">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="text-center text-slate-400">or</div>

          <div>
            <Label htmlFor="csv-text" className="text-slate-300 text-sm">
              Paste CSV Data
            </Label>
            <Textarea
              id="csv-text"
              placeholder="name,age,email&#10;John,30,john@example.com&#10;Jane,25,jane@example.com"
              value={formData.csvText || formData.fileContent || ""}
              onChange={(e) => updateFormData("csvText", e.target.value)}
              className="bg-slate-800 border-slate-600 text-white mt-2 h-48 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderDatabaseForm = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="dbConnectionString" className="text-white">
          Connection String *
        </Label>
        <Input
          id="dbConnectionString"
          type="text"
          placeholder={
            source === "mongodb"
              ? "mongodb://username:password@host:port/database"
              : source === "mysql"
                ? "mysql://username:password@host:port/database"
                : "postgresql://username:password@host:port/database"
          }
          value={formData.dbConnectionString || ""}
          onChange={(e) => updateFormData("dbConnectionString", e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-2"
        />
      </div>

      <div>
        <Label htmlFor="dbName" className="text-white">
          Database Name *
        </Label>
        <Input
          id="dbName"
          type="text"
          placeholder="my_database"
          value={formData.dbName || ""}
          onChange={(e) => updateFormData("dbName", e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-2"
        />
      </div>

      <div>
        <Label htmlFor="collectionName" className="text-white">
          {source === "mongodb" ? "Collection Name" : "Table Name"} *
        </Label>
        <Input
          id="collectionName"
          type="text"
          placeholder={source === "mongodb" ? "users" : "users"}
          value={formData.collectionName || ""}
          onChange={(e) => updateFormData("collectionName", e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-2"
        />
      </div>

      {(source === "mysql" || source === "postgresql") && (
        <div>
          <Label htmlFor="dbSchema" className="text-white">
            Schema Name
          </Label>
          <Input
            id="dbSchema"
            type="text"
            placeholder={source === "postgresql" ? "public" : "optional"}
            value={formData.dbSchema || ""}
            onChange={(e) => updateFormData("dbSchema", e.target.value)}
            className="bg-slate-800 border-slate-600 text-white mt-2"
          />
        </div>
      )}
    </div>
  )

  const getTitle = () => {
    switch (source) {
      case "api":
        return "API Endpoint Configuration"
      case "json":
        return "JSON Data Input"
      case "csv":
        return "CSV Data Input"
      case "mongodb":
        return "MongoDB Connection"
      case "mysql":
        return "MySQL Connection"
      case "postgresql":
        return "PostgreSQL Connection"
      default:
        return "Data Input"
    }
  }

  const getDescription = () => {
    switch (source) {
      case "api":
        return "Enter your API endpoint to fetch data for schema generation"
      case "json":
        return "Provide JSON data either by uploading a file or pasting directly"
      case "csv":
        return "Provide CSV data either by uploading a file or pasting directly"
      case "mongodb":
        return "Enter your MongoDB connection details to analyze collection structure"
      case "mysql":
        return "Enter your MySQL connection details to analyze table structure"
      case "postgresql":
        return "Enter your PostgreSQL connection details to analyze table structure"
      default:
        return "Provide your data source details"
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{getTitle()}</h3>
        <p className="text-slate-400">{getDescription()}</p>
        {(source === "mongodb" || source === "mysql" || source === "postgresql") && <p className="text-slate-400">(Connection strings may contain passwords, using CLI tool is highly recommended)</p>}
      </div>

      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-6">
          {source === "api" && renderApiForm()}
          {source === "json" && renderJsonForm()}
          {source === "csv" && renderCsvForm()}
          {(source === "mongodb" || source === "mysql" || source === "postgresql") && renderDatabaseForm()}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
