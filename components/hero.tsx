"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, ArrowRight, Terminal, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm i -g autoinfer")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            The Tool for Modern Developers
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            AutoInfer
          </h1>

          {/* Sub Headline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Effortlessly Generate <span className="text-blue-400 font-semibold">TypeScript Interfaces</span> &
            <span className="text-purple-400 font-semibold"> JSON Schemas</span> from Any Data Source.
            <br />
            <span className="text-green-400">Streamline Your Workflow.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/generate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Generate Your Schema Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="https://dub.sh/autoinfer-npm" target="_blank">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                View on NPM
              </Button>
            </Link>
          </div>

          {/* NPM Installation Card */}
          <Card className="max-w-md mx-auto bg-slate-900/80 border-slate-700 backdrop-blur-sm shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Install Globally</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-green-400 text-lg border border-slate-700">
                npm i -g autoinfer
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">6+</div>
              <div className="text-slate-400 text-sm">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
              <div className="text-slate-400 text-sm">Output Formats</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-slate-400 text-sm">Time Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
