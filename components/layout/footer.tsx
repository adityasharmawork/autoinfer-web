import Link from "next/link"
import { Terminal, Github, Download, Mail, Heart, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AutoInfer</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              The ultimate tool for modern developers to generate TypeScript interfaces and JSON schemas from any data
              source. Streamline your workflow and eliminate manual typing.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://dub.sh/adityagithub"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://dub.sh/adityalinkedin"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://dub.sh/adityax"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://dub.sh/autoinfer-npm"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
              </Link>
              {/* <Link href="mailto:support@autoinfer.dev" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link> */}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/generate" className="text-slate-400 hover:text-white transition-colors">
                  Web Generator
                </Link>
              </li>
              <li>
                <Link
                  href="https://dub.sh/autoinfer-npm"
                  target="_blank"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  CLI Tool
                </Link>
              </li>
              {/* <li>
                <Link href="/docs" className="text-slate-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-slate-400 hover:text-white transition-colors">
                  Examples
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          {/* <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/getting-started" className="text-slate-400 hover:text-white transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-slate-400 hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/autoinfer/autoinfer/issues"
                  target="_blank"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Report Issues
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div> */}

        {/* Other Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://dub.sh/replix/" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                  Replix IDE
                </Link>
              </li>
              <li>
                <Link href="https://dub.sh/algosprint/" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                  AlgoSprint
                </Link>
              </li>
              <li>
                <Link
                  href="https://dub.sh/amber/"
                  target="_blank"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Amber
                </Link>
              </li>
              {/* <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"> */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center">
          {/* <div className="text-slate-400 text-sm mb-4 md:mb-0">© 2024 AutoInfer. All rights reserved.</div> */}
          <div className="flex items-center justify-center space-x-1 text-slate-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
