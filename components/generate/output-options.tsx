"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Code2, FileJson, Loader2, Sparkles } from "lucide-react"

type OutputType = "typescript" | "jsonschema"

interface OutputOptions {
  interfaceName: string
  inferOptional: boolean
  prettify: boolean
}

interface OutputOptionsProps {
  outputType: OutputType
  options: OutputOptions
  onOutputTypeChange: (type: OutputType) => void
  onOptionsChange: (options: OutputOptions) => void
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

export function OutputOptions({
  outputType,
  options,
  onOutputTypeChange,
  onOptionsChange,
  onGenerate,
  isGenerating,
}: OutputOptionsProps) {
  const updateOption = (key: keyof OutputOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Configure Output</h3>
        <p className="text-slate-400">Choose your output format and customize the generation options</p>
      </div>

      <div className="space-y-8">
        {/* Output Type Selection */}
        <Card className="bg-slate-900/50 border-slate-700">
          <div className="p-6">
            <Label className="text-white text-lg mb-4 block">Output Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  outputType === "typescript"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => onOutputTypeChange("typescript")}
              >
                <div className="flex items-center space-x-3">
                  <Code2 className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="text-white font-semibold">TypeScript Interface</h4>
                    <p className="text-slate-400 text-sm">Generate type-safe TypeScript interfaces</p>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  outputType === "jsonschema"
                    ? "border-green-500 bg-green-500/10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => onOutputTypeChange("jsonschema")}
              >
                <div className="flex items-center space-x-3">
                  <FileJson className="w-6 h-6 text-green-400" />
                  <div>
                    <h4 className="text-white font-semibold">JSON Schema</h4>
                    <p className="text-slate-400 text-sm">Generate JSON Schema for validation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Generation Options */}
        <Card className="bg-slate-900/50 border-slate-700">
          <div className="p-6">
            <Label className="text-white text-lg mb-4 block">Generation Options</Label>
            <div className="space-y-6">
              <div>
                <Label htmlFor="interfaceName" className="text-white">
                  {outputType === "typescript" ? "Interface Name" : "Schema Title"}
                </Label>
                <Input
                  id="interfaceName"
                  value={options.interfaceName}
                  onChange={(e) => updateOption("interfaceName", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                  placeholder={outputType === "typescript" ? "MyInterface" : "MySchema"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Infer Optional Properties</Label>
                  <p className="text-slate-400 text-sm">Fields not present in all samples become optional</p>
                </div>
                <Switch
                  checked={options.inferOptional}
                  onCheckedChange={(checked) => updateOption("inferOptional", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Prettify Output</Label>
                  <p className="text-slate-400 text-sm">Format the generated code for better readability</p>
                </div>
                <Switch checked={options.prettify} onCheckedChange={(checked) => updateOption("prettify", checked)} />
              </div>
            </div>
          </div>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate {outputType === "typescript" ? "Interface" : "Schema"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
