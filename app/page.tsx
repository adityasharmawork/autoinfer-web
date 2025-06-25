import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Benefits } from "@/components/benefits"
import { CTA } from "@/components/cta"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Hero />
      <Features />
      <Benefits />
      <CTA />
    </main>
  )
}
