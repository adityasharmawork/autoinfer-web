"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, Download, RotateCcw, Code2, FileJson } from "lucide-react"

type OutputType = "typescript" | "jsonschema"

interface ResultDisplayProps {
  result: string
  outputType: OutputType
  onStartOver: () => void
}

export function ResultDisplay({ result, outputType, onStartOver }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    const extension = outputType === "typescript" ? "ts" : "json"
    const filename = `generated-${outputType === "typescript" ? "interface" : "schema"}.${extension}`

    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {outputType === "typescript" ? (
            <Code2 className="w-8 h-8 text-blue-400" />
          ) : (
            <FileJson className="w-8 h-8 text-green-400" />
          )}
          <h3 className="text-2xl font-bold text-white">
            {outputType === "typescript" ? "TypeScript Interface" : "JSON Schema"} Generated!
          </h3>
        </div>
        <p className="text-slate-400">Your schema has been successfully generated and is ready to use</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-700 mb-8">
        <div className="p-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>

            <Button
              onClick={downloadFile}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>

          {/* Code Display */}
          <div className="relative">
            <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-700">
              <code className={`text-sm ${outputType === "typescript" ? "text-blue-300" : "text-green-300"}`}>
                {result}
              </code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Start Over Button */}
      <div className="text-center">
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  )
}
