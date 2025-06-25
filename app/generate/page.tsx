"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DataSourceSelector } from "@/components/generate/data-source-selector"
import { DataInputForm } from "@/components/generate/data-input-form"
import { OutputOptions } from "@/components/generate/output-options"
import { ResultDisplay } from "@/components/generate/result-display"
import Link from "next/link"
import { generateSchema } from "@/lib/schema-generator"

type Step = "source" | "input" | "options" | "result"
type DataSource = "api" | "json" | "csv" | "mongodb" | "mysql" | "postgresql"
type OutputType = "typescript" | "jsonschema"

interface GenerationData {
  source: DataSource | null
  inputData: any
  outputType: OutputType
  options: {
    interfaceName: string
    inferOptional: boolean
    prettify: boolean
  }
}

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<Step>("source")
  const [generationData, setGenerationData] = useState<GenerationData>({
    source: null,
    inputData: null,
    outputType: "typescript",
    options: {
      interfaceName: "GeneratedInterface",
      inferOptional: true,
      prettify: true,
    },
  })
  const [result, setResult] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const steps = [
    { id: "source", title: "Choose Data Source", completed: !!generationData.source },
    { id: "input", title: "Provide Data", completed: !!generationData.inputData },
    { id: "options", title: "Configure Output", completed: currentStep === "result" },
    { id: "result", title: "View Result", completed: !!result },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  const handleNext = () => {
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id as Step)
    }
  }

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id as Step)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "source":
        return !!generationData.source
      case "input":
        return !!generationData.inputData
      case "options":
        return true
      default:
        return false
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const { generateSchema } = await import("@/lib/schema-generator")
      const result = await generateSchema(generationData)
      setResult(result)
      setCurrentStep("result")
    } catch (error) {
      console.error("Generation failed:", error)
      // Show error to user
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold">AutoInfer Generator</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                        ? "border-blue-500 text-blue-400"
                        : "border-slate-600 text-slate-400"
                  }`}
                >
                  {step.completed ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step.completed ? "bg-green-500" : "bg-slate-600"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{steps.find((s) => s.id === currentStep)?.title}</h2>
            <p className="text-slate-400">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <div className="p-8">
            {currentStep === "source" && (
              <DataSourceSelector
                selected={generationData.source}
                onSelect={(source) => setGenerationData((prev) => ({ ...prev, source }))}
              />
            )}

            {currentStep === "input" && generationData.source && (
              <DataInputForm
                source={generationData.source}
                data={generationData.inputData}
                onDataChange={(inputData) => setGenerationData((prev) => ({ ...prev, inputData }))}
              />
            )}

            {currentStep === "options" && (
              <OutputOptions
                outputType={generationData.outputType}
                options={generationData.options}
                onOutputTypeChange={(outputType) => setGenerationData((prev) => ({ ...prev, outputType }))}
                onOptionsChange={(options) => setGenerationData((prev) => ({ ...prev, options }))}
                onGenerate={async () => {
                  setIsGenerating(true)
                  try {
                    const result = await generateSchema(generationData)
                    setResult(result)
                    setCurrentStep("result")
                  } catch (error: any) {
                    console.error("Generation failed:", error)
                    // You might want to show an error state here
                    alert(`Generation failed: ${error.message}`)
                  } finally {
                    setIsGenerating(false)
                  }
                }}
                isGenerating={isGenerating}
              />
            )}

            {currentStep === "result" && (
              <ResultDisplay
                result={result}
                outputType={generationData.outputType}
                onStartOver={() => {
                  setCurrentStep("source")
                  setGenerationData({
                    source: null,
                    inputData: null,
                    outputType: "typescript",
                    options: {
                      interfaceName: "GeneratedInterface",
                      inferOptional: true,
                      prettify: true,
                    },
                  })
                  setResult("")
                }}
              />
            )}
          </div>

          {/* Navigation */}
          {currentStep !== "result" && (
            <div className="flex justify-between items-center p-8 pt-0">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button onClick={handleNext} disabled={!canProceed()} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
