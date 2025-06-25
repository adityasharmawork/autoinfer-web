"use client";
import { useState, useEffect } from 'react';
import { Terminal, Code, Database, FileJson, Link, ChevronsRight, Copy, Check, Settings, GitBranch, Book } from 'lucide-react';

// Helper component for copying code snippets
const CodeSnippet = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = typeof children === 'string' ? children : children.props.children;
        // A cross-browser compatible way to copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="relative group bg-gray-800/50 backdrop-blur-sm border border-slate-700 rounded-lg my-4">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
                aria-label="Copy code"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <pre className="p-4 text-sm overflow-x-auto">
                <code className="language-bash">{children}</code>
            </pre>
        </div>
    );
};

// Main Docs Page Component
export default function AutoInferDocs() {
    const [visibleSection, setVisibleSection] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );

        const sections = document.querySelectorAll('.docs-section');
        sections.forEach((section) => observer.observe(section));

        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const navLinks = [
        { id: 'getting-started', title: 'Getting Started', icon: <ChevronsRight size={16}/> },
        { id: 'quick-demo', title: 'Quick Demo', icon: <ChevronsRight size={16}/> },
        { id: 'usage', title: 'Usage', icon: <Book size={16} /> },
        { id: 'interactive-mode', title: 'Interactive Mode', icon: <Terminal size={16}/> },
        { id: 'cli-mode', title: 'CLI Mode', icon: <Code size={16}/> },
        { id: 'data-sources', title: 'Data Sources', icon: <Database size={16}/> },
        { id: 'advanced-options', title: 'Advanced Options', icon: <Settings size={16}/> },
    ];

    return (
        <div className="bg-slate-900 text-slate-300 font-sans antialiased">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <header className="text-center mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter animate-fadeInUp">
                        AutoInfer Docs
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Effortlessly generate TypeScript interfaces and JSON schemas from any data source.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="lg:w-1/4 lg:sticky top-20 self-start hidden lg:block">
                        <nav className="space-y-2">
                             {navLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                                      visibleSection === link.id
                                        ? 'bg-sky-500/10 text-sky-400'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    } ${['interactive-mode', 'cli-mode'].includes(link.id) ? 'ml-4' : ''}`}
                                >
                                    {link.icon}
                                    <span>{link.title}</span>
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 space-y-20">
                        {/* Getting Started Section */}
                        <section id="getting-started" className="docs-section scroll-mt-20">
                             <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white mb-6">
                                <ChevronsRight className="text-sky-400"/>
                                Getting Started
                            </h2>
                            <p className="mb-4">
                                AutoInfer is a powerful CLI tool designed to streamline your development workflow. To get started, you'll need to have Node.js and npm installed. You can then install AutoInfer globally on your system.
                            </p>
                            <CodeSnippet>{`npm install -g autoinfer`}</CodeSnippet>
                            <p>Once installed, you can access the tool from anywhere in your terminal using the `autoinfer` command.</p>
                        </section>

                        {/* Quick Demo Section */}
                        <section id="quick-demo" className="docs-section scroll-mt-20">
                            <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white mb-6">
                                <Terminal className="text-sky-400"/>
                                Quick Demo
                            </h2>
                            <p className="mb-6">
                                See AutoInfer in action! Here's a quick demonstration of the interactive mode, inferring a TypeScript interface from a public API endpoint.
                            </p>
                            <div className="bg-black rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
                                <div className="p-3 bg-slate-800/70 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    <span className="text-xs text-slate-400 ml-auto">zsh</span>
                                </div>
                                <div className="p-4 text-sm font-mono terminal-demo">
                                    <p>$ autoinfer</p>
                                    <p><span className="text-cyan-400">?</span> Select data source type: <span className="text-green-400">› API</span></p>
                                    <p><span className="text-cyan-400">?</span> Enter API endpoint URL: <span className="text-green-400">› https://api.publicapis.org/entries</span></p>
                                    <p><span className="text-cyan-400">?</span> Select output format: <span className="text-green-400">› TypeScript</span></p>
                                    <p><span className="text-cyan-400">?</span> Interface name: <span className="text-green-400">› Entries</span></p>
                                    <p>... and a few more questions ...</p>
                                    <p className="text-green-400 mt-4">✓ Output generated!</p>
                                    <pre className="text-slate-300 mt-2 text-xs"><code>{`export interface Entries {
  count: number;
  entries: Entry[];
}

export interface Entry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}`}</code></pre>
                                </div>
                            </div>
                        </section>
                        
                        {/* Usage Section */}
                        <section id="usage" className="docs-section scroll-mt-20">
                             <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white mb-6">
                                <Book className="text-sky-400"/>
                                Usage
                            </h2>
                             <p className="mb-6">
                                AutoInfer offers two primary modes of operation to fit your needs: a user-friendly interactive prompt and a powerful direct command-line interface for automation and scripting.
                            </p>
                        </section>

                        {/* Interactive Mode Section */}
                        <section id="interactive-mode" className="docs-section scroll-mt-20">
                            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white mb-6">
                                <Terminal className="text-fuchsia-400" />
                                Interactive Mode
                            </h3>
                            <p className="mb-4">
                                For a guided experience, simply run `autoinfer` with no arguments. The tool will walk you through a series of questions to configure your schema generation.
                            </p>
                            <CodeSnippet>{`autoinfer`}</CodeSnippet>
                             <p className="mt-6 font-semibold text-white">The process involves these steps:</p>
                             <ul className="mt-4 space-y-4 list-inside">
                                <li className="flex items-start gap-3"><ChevronsRight className="text-fuchsia-400 mt-1 flex-shrink-0" size={18} /><span><strong>Select Data Source:</strong> Choose from API, JSON, CSV, or a database.</span></li>
                                <li className="flex items-start gap-3"><ChevronsRight className="text-fuchsia-400 mt-1 flex-shrink-0" size={18} /><span><strong>Provide Input:</strong> Enter the URL for an API, the file path for a local file, or connection details for a database.</span></li>
                                <li className="flex items-start gap-3"><ChevronsRight className="text-fuchsia-400 mt-1 flex-shrink-0" size={18} /><span><strong>Choose Output Format:</strong> Select either TypeScript or JSON Schema.</span></li>
                                <li className="flex items-start gap-3"><ChevronsRight className="text-fuchsia-400 mt-1 flex-shrink-0" size={18} /><span><strong>Configure Options:</strong> Set the interface/schema name, decide on optional properties, add custom fields, and more.</span></li>
                                <li className="flex items-start gap-3"><ChevronsRight className="text-fuchsia-400 mt-1 flex-shrink-0" size={18} /><span><strong>Save or Print:</strong> Choose to save the output to a file or print it directly to the console.</span></li>
                             </ul>
                        </section>

                        {/* CLI Mode Section */}
                        <section id="cli-mode" className="docs-section scroll-mt-20">
                            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white mb-6">
                                <Code className="text-emerald-400" />
                                CLI (Flag-Based) Mode
                            </h3>
                             <p className="mb-4">
                                For scripting and quick, one-off generations, you can pass flags directly to the command. This bypasses the interactive prompt.
                            </p>
                             <p className="mt-6 font-semibold text-white mb-4">Core Flags:</p>
                            <div className="space-y-3">
                                <p><code>-s, --source &lt;type&gt;</code>: (Required) The data source. Ex: <code>api</code>, <code>json</code>, <code>csv</code>.</p>
                                <p><code>-o, --output &lt;format&gt;</code>: The output format. Ex: <code>typescript</code>, <code>jsonschema</code>. Defaults to <code>typescript</code>.</p>
                                <p><code>-i, --interfaceName &lt;name&gt;</code>: The name for the main interface or schema title. Defaults to <code>Generated</code>.</p>
                                <p><code>--outFile &lt;path&gt;</code>: Path to save the output file. If omitted, prints to console.</p>
                            </div>
                            
                            <p className="mt-6 font-semibold text-white mb-4">Example: Generate TypeScript from a local JSON file</p>
                            <CodeSnippet>{`autoinfer -s json -f ./data.json -o typescript -i User --outFile ./types/user.ts`}</CodeSnippet>

                            <p className="mt-6 font-semibold text-white mb-4">Example: Generate JSON Schema from an API</p>
                            <CodeSnippet>{`autoinfer -s api -u "https://jsonplaceholder.typicode.com/users/1" -o jsonschema -i UserSchema --prettify`}</CodeSnippet>
                        </section>
                        
                        {/* Data Sources Section */}
                        <section id="data-sources" className="docs-section scroll-mt-20">
                            <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white mb-6">
                                <Database className="text-sky-400"/>
                                Data Sources
                            </h2>
                            <p className="mb-6">
                                AutoInfer can infer schemas from various sources. Each source has specific flags.
                            </p>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><Link size={18}/>API</h4>
                                    <p>Use the <code>--url</code> or <code>-u</code> flag to specify the API endpoint.</p>
                                    <CodeSnippet>{`autoinfer -s api -u <your-api-url>`}</CodeSnippet>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><FileJson size={18}/>JSON</h4>
                                    <p>Use the <code>--file</code> (<code>-f</code>) flag for a local file or <code>--json-input</code> (<code>-j</code>) for a direct string.</p>
                                     <CodeSnippet>{`# From a file
autoinfer -s json -f ./users.json

# From a string
autoinfer -s json -j '{"id": 1, "name": "Leanne"}'`}</CodeSnippet>
                                </div>
                                 <div>
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><GitBranch size={18}/>CSV</h4>
                                    <p>Use the <code>--file</code> or <code>-f</code> flag to specify the path to your CSV file.</p>
                                    <CodeSnippet>{`autoinfer -s csv -f ./data.csv`}</CodeSnippet>
                                </div>
                                 <div>
                                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><Database size={18}/>Databases (MongoDB, PostgreSQL, MySQL)</h4>
                                    <p>For database sources, you need to provide connection details.</p>
                                    <CodeSnippet>{`# MongoDB
autoinfer -s mongodb --dbConnectionString "..." --dbName "..." --collectionName "..."

# PostgreSQL
autoinfer -s postgresql --dbConnectionString "..." --tableName "..." --dbSchema "public"`}</CodeSnippet>
                                </div>
                            </div>
                        </section>

                        {/* Advanced Options Section */}
                        <section id="advanced-options" className="docs-section scroll-mt-20">
                             <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white mb-6">
                                <Settings className="text-sky-400"/>
                                Advanced Options
                            </h2>
                            <p className="mb-6">Fine-tune the output with these advanced flags.</p>
                             <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-white"><code>--inferOptional</code> / <code>--no-inferOptional</code></h4>
                                    <p>Controls whether fields that aren't present in every object of a sample array are marked as optional (e.g., <code>name?: string</code>). By default, this is enabled for file/API sources and disabled for SQL sources.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white"><code>--prettify</code> / <code>-p</code></h4>
                                    <p>Formats the output with proper indentation for better readability.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white"><code>--customFields &lt;jsonstring&gt;</code></h4>
                                    <p>Adds extra fields to the root of the generated schema. The value must be a valid JSON string.</p>
                                    <CodeSnippet>{`autoinfer -s json -f data.json --customFields '[{"name":"status","type":"string"}, {"name":"tags","type":"array_string"}]'`}</CodeSnippet>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white"><code>--verbose</code></h4>
                                    <p>Enables detailed error logging, including stack traces, which is helpful for debugging.</p>
                                </div>
                             </div>
                        </section>

                    </main>
                </div>
            </div>
             <footer className="text-center py-8 border-t border-slate-800/50 mt-16">
                <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} AutoInfer. All Rights Reserved.</p>
            </footer>
             <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .terminal-demo p {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }
                .terminal-demo p:nth-child(1) { animation-delay: 0.1s; }
                .terminal-demo p:nth-child(2) { animation-delay: 0.3s; }
                .terminal-demo p:nth-child(3) { animation-delay: 0.6s; }
                .terminal-demo p:nth-child(4) { animation-delay: 0.9s; }
                .terminal-demo p:nth-child(5) { animation-delay: 1.2s; }
                .terminal-demo p:nth-child(6) { animation-delay: 1.5s; }
                .terminal-demo pre { animation-delay: 1.8s; opacity:0; animation: fadeInUp 0.5s ease-out forwards;}
            `}</style>
        </div>
    );
}

