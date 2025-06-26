import { Card } from "@/components/ui/card"
import {
  Globe,
  FileText,
  Braces,
  Database,
  Server,
  Layers,
  Code2,
  FileJson,
  Zap,
  Shield,
  Cpu,
  Workflow,
} from "lucide-react"

const dataSources = [
  {
    icon: Globe,
    title: "API Endpoints",
    description: "Fetch and analyze REST API responses to generate schemas automatically",
    color: "text-blue-400",
  },
  {
    icon: FileText,
    title: "CSV Files",
    description: "Upload or paste CSV data to infer structured type definitions",
    color: "text-green-400",
  },
  {
    icon: Braces,
    title: "JSON Data",
    description: "Parse JSON objects and arrays to create comprehensive interfaces",
    color: "text-yellow-400",
  },
  {
    icon: Database,
    title: "MongoDB",
    description: "Connect to MongoDB collections and analyze document structures",
    color: "text-emerald-400",
  },
  {
    icon: Server,
    title: "MySQL",
    description: "Extract table schemas from MySQL databases with full type mapping",
    color: "text-orange-400",
  },
  {
    icon: Layers,
    title: "PostgreSQL",
    description: "Generate types from PostgreSQL tables with advanced type support",
    color: "text-purple-400",
  },
]

const outputFormats = [
  {
    icon: Code2,
    title: "TypeScript Interfaces",
    description: "Generate clean, type-safe TypeScript interfaces for your applications",
    color: "text-blue-400",
  },
  {
    icon: FileJson,
    title: "JSON Schema",
    description: "Create comprehensive JSON Schema definitions for validation and documentation",
    color: "text-green-400",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate schemas in seconds, not hours",
    color: "text-yellow-400",
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "Eliminate runtime errors with precise type definitions",
    color: "text-green-400",
  },
  {
    icon: Cpu,
    title: "Smart Inference",
    description: "Advanced algorithms detect patterns and optional fields",
    color: "text-purple-400",
  },
  {
    icon: Workflow,
    title: "Workflow Ready",
    description: "Integrate seamlessly into your development pipeline",
    color: "text-blue-400",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 my-12">
        {/* Data Sources */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-8">
            Connect to <span className="text-blue-400">Any Data Source</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            AutoInfer supports multiple data sources, making it the most versatile schema generation tool for modern
            developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {dataSources.map((source, index) => (
            <Card
              key={index}
              className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors ${source.color}`}
                  >
                    <source.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white ml-4">{source.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">{source.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Output Formats */}
        <div className="text-center mt-40 mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Generate <span className="text-purple-400">Professional Output</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-8">
            Choose from industry-standard formats that integrate perfectly with your development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto">
          {outputFormats.map((format, index) => (
            <Card
              key={index}
              className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group"
            >
              <div className="p-8 text-center">
                <div
                  className={`inline-flex p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors ${format.color} mb-6`}
                >
                  <format.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{format.title}</h3>
                <p className="text-slate-400 leading-relaxed">{format.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="text-center mt-40 mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-green-400">AutoInfer</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group text-center"
            >
              <div className="p-6">
                <div
                  className={`inline-flex p-3 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors ${benefit.color} mb-4`}
                >
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
