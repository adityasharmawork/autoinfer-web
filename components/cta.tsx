import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Download, Globe, Github } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700 backdrop-blur-sm shadow-2xl">
          <div className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-blue-400">Supercharge</span> Your Workflow?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who have already transformed their development process. Start generating
              schemas in seconds, not hours.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/generate">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Try Web Version
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="https://dub.sh/autoinfer-npm" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-10 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Install CLI
                </Button>
              </Link>
            </div>

            {/* Quick Install */}
            <div className="bg-slate-950/50 rounded-xl p-6 max-w-md mx-auto mb-8 border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Quick Install:</div>
              <div className="font-mono text-green-400 text-lg">npm i -g autoinfer</div>
            </div>

            {/* Footer Links */}
            <div className="flex justify-center space-x-8 text-slate-400">
              <Link
                href="https://github.com/autoinfer/autoinfer"
                target="_blank"
                className="flex items-center hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Link>
              <Link
                href="https://dub.sh/autoinfer-npm"
                target="_blank"
                className="flex items-center hover:text-white transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                NPM Package
              </Link>
              <Link href="/docs" className="flex items-center hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
