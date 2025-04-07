import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, BarChart3, FileText, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">InsureAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/quote" className="text-sm font-medium hover:underline underline-offset-4">
              Get a Quote
            </Link>
            <Link href="/claims" className="text-sm font-medium hover:underline underline-offset-4">
              Claims
            </Link>
            <Link href="/assistant" className="text-sm font-medium hover:underline underline-offset-4">
              AI Assistant
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Insurance Powered by <span className="text-primary">Artificial Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[800px] mb-10">
              Experience the future of insurance with our AI-driven platform. Get personalized quotes, manage policies,
              and process claims with unprecedented speed and accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button size="lg" className="gap-2">
                  Get a Quote <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/assistant">
                <Button size="lg" variant="outline" className="gap-2">
                  Talk to AI Assistant <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 container">
          <h2 className="text-3xl font-bold text-center mb-16">Our AI-Powered Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Dynamic Quote Generation</h3>
              <p className="text-muted-foreground">
                Our AI analyzes thousands of data points to provide you with the most competitive and personalized
                insurance quotes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Advanced risk visualization and assessment tools help you understand and mitigate potential risks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Automated Claims Processing</h3>
              <p className="text-muted-foreground">
                Submit and track claims with our AI-powered system that processes claims faster and more accurately.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">InsureAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 InsureAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

