"use client"

import { Button } from "@/components/ui/button"
import { Shield, Zap, Eye, BarChart3, AlertTriangle, TrendingUp } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-[#0077B6] mb-4" />
            </div>
            <h1 className="text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              NISHTHA
            </h1>
            <h2 className="text-2xl font-semibold text-[#0077B6] mb-6 text-balance">
              Your First Step to Scam-Free Careers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Protect yourself from fraudulent job postings with AI-powered analysis. Get instant insights and make
              informed career decisions.
            </p>
          </div>

          {/* Value Proposition */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-[#0077B6]/10 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-[#0077B6]" />
              </div>
              <h3 className="font-semibold mb-2">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Paste any job ad → get instant scam/legit analysis in under 5 seconds
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-red-500/10 p-3 rounded-full mb-4">
                <Eye className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">Scam Highlighting</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Scam keywords highlighted in red with detailed explanations
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-green-500/10 p-3 rounded-full mb-4">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Company Verification</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Check company credibility: followers, employees, engagement metrics
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-orange-500/10 p-3 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Scam Personas</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Quick-money hustler, phantom employer, shady recruiter labels
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-purple-500/10 p-3 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Risk Meter</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Confidence score displayed as an intuitive risk meter
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border">
              <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Advanced pattern recognition and keyword analysis technology
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-16">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-[#0077B6] hover:bg-[#005a8a] text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>

          {/* Footer */}
          <footer className="text-center">
            <p className="text-sm text-muted-foreground">Built for Google GenAI Exchange Hackathon, 2025</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
