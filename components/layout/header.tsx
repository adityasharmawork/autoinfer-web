"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Terminal, Github, Download } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">AutoInfer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/generate" className="text-slate-300 hover:text-white transition-colors">
              Generate
            </Link>
            <Link href="/docs" className="text-slate-300 hover:text-white transition-colors">
              Docs
            </Link>
            {/* <Link
              href="https://github.com/autoinfer/autoinfer"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link> */}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://dub.sh/autoinfer-npm" target="_blank">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Download className="w-4 h-4 mr-2" />
                Install CLI
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Try Online
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/generate" className="text-slate-300 hover:text-white transition-colors">
                Generate
              </Link>
              <Link href="/docs" className="text-slate-300 hover:text-white transition-colors">
                Docs
              </Link>
              <Link
                href="https://github.com/autoinfer/autoinfer"
                target="_blank"
                className="text-slate-300 hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="https://dub.sh/autoinfer-npm" target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install CLI
                  </Button>
                </Link>
                <Link href="/generate">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Try Online
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
