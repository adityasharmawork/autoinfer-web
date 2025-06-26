import { Card } from "@/components/ui/card"
import { Clock, Target, Repeat, TrendingUp, Users, Rocket, CheckCircle } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Save Hours of Manual Work",
    description:
      "Eliminate the tedious process of manually creating type definitions. What used to take hours now takes seconds.",
    stats: "90% faster",
    color: "text-blue-400",
  },
  {
    icon: Target,
    title: "Eliminate Human Error",
    description: "Automated inference ensures accuracy and consistency across your entire codebase.",
    stats: "100% accurate",
    color: "text-green-400",
  },
  {
    icon: Repeat,
    title: "Maintain Consistency",
    description: "Keep your data structures uniform across different parts of your application.",
    stats: "Always consistent",
    color: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Improve Developer Experience",
    description: "Faster development cycles, better IntelliSense, and fewer runtime errors.",
    stats: "3x productivity",
    color: "text-yellow-400",
  },
]

const useCases = [
  "API Integration Projects",
  "Database Migration Scripts",
  "Data Validation Pipelines",
  "Documentation Generation",
  "Code Generation Tools",
  "Testing Framework Setup",
]

export function Benefits() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold text-white mb-4">
            Transform Your <span className="text-blue-400">Development Workflow</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mt-8 mb-16">
            Join thousands of developers who have revolutionized their workflow with AutoInfer. Experience the power of
            automated schema generation.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-48">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors ${benefit.color}`}
                  >
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full bg-slate-800 ${benefit.color}`}>
                        {benefit.stats}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-16">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Perfect for <span className="text-green-400">Every Project</span>
            </h3>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Whether you're building a small prototype or a large-scale enterprise application, AutoInfer adapts to
              your needs and scales with your project.
            </p>

            <div className="space-y-3">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-lg font-semibold text-white">Developer Testimonial</span>
                </div>
                <blockquote className="text-slate-300 text-lg leading-relaxed mb-6">
                  "AutoInfer has completely changed how I approach API integration. What used to take me hours of manual
                  typing now happens in seconds. It's become an essential part of my development toolkit."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">A</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Anonymous</div>
                    <div className="text-slate-400 text-sm">Senior Full Stack Developer</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              <Rocket className="w-4 h-4 inline mr-1" />
              100+ Downloads
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
