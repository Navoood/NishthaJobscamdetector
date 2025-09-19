"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Shield, CheckCircle, Info, Building2 } from "lucide-react"
import { JobAnalysisResult } from "@/components/job-analysis-result"
import { StatsBanner } from "@/components/stats-banner"
import { CompanyStatsCard } from "@/components/company-stats-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrendStats } from "@/components/trend-stats"
import { LandingPage } from "@/components/landing-page"

const LOADING_MESSAGES = [
  "⏳ Great things take time...",
  "🔍 Scanning every suspicious word...",
  "🧠 Our AI brain is thinking hard...",
  "⚡ Almost there, trust the process...",
  "🕵️ Investigating this job posting...",
  "🔬 Running deep analysis...",
  "🛡️ Protecting you from scams...",
  "🎯 Targeting red flags...",
]

export default function HomePage() {
  const [showLanding, setShowLanding] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [jobText, setJobText] = useState("")
  const [companyInput, setCompanyInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [companyStats, setCompanyStats] = useState<any>(null)
  const [loadingMessage, setLoadingMessage] = useState("")

  const handleGetStarted = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowLanding(false)
      setIsTransitioning(false)
    }, 600) // 0.6s transition duration
  }

  const handleCompanyLookup = async () => {
    if (!companyInput.trim()) return

    try {
      const response = await fetch("/api/company-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyInput: companyInput.trim() }),
      })

      const data = await response.json()
      setCompanyStats(data)
    } catch (error) {
      console.error("Company lookup failed:", error)
    }
  }

  const handleAnalyze = async () => {
    if (!jobText.trim()) return

    setIsAnalyzing(true)
    setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])

    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobText }),
      })

      const data = await response.json()
      setResult(data)

      if ((window as any).updateTrendStats) {
        ;(window as any).updateTrendStats(data.isScam)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
      setLoadingMessage("")
    }
  }

  const handleClear = () => {
    setJobText("")
    setCompanyInput("")
    setCompanyStats(null)
    setResult(null)
  }

  if (showLanding) {
    return (
      <div className={`transition-opacity duration-600 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <LandingPage onGetStarted={handleGetStarted} />
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-background transition-opacity duration-600 ease-in-out ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-balance">NISHTHA - Job Scam Detector</h1>
                <p className="text-muted-foreground text-pretty">
                  Protect yourself from fraudulent job postings with AI-powered analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowLanding(true)} className="text-sm">
                ← Back to Home
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        <StatsBanner />

        <TrendStats />

        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Hackathon MVP Demo:</strong> This AI-powered tool analyzes job postings for scam indicators using
            pattern recognition and keyword analysis. Try the examples below to see it in action!
          </AlertDescription>
        </Alert>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Analyze Job Posting
                </CardTitle>
                <CardDescription>
                  Paste the job posting text below to check for potential scam indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job posting here (title, description, requirements, company info)..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="space-y-2">
                  <Label htmlFor="company-input" className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Company Name / LinkedIn URL (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="company-input"
                      placeholder="e.g., Google, Microsoft, or linkedin.com/company/google"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCompanyLookup}
                      disabled={!companyInput.trim()}
                      className="shrink-0 bg-transparent"
                    >
                      Lookup
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Auto-fill company stats to improve scam detection accuracy
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAnalyze} disabled={!jobText.trim() || isAnalyzing} className="flex-1">
                    {isAnalyzing ? loadingMessage : "Analyze Job"}
                  </Button>
                  <Button variant="outline" onClick={handleClear} disabled={!jobText && !result}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try These Examples</CardTitle>
                <CardDescription>Click to load sample job postings for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent hover:bg-destructive/5 border-destructive/20"
                  onClick={() =>
                    setJobText(
                      "🚨 URGENT HIRING! 🚨\n\nWork from home and earn $5000/week! No experience needed, no interviews required! Just send $50 processing fee to secure your position. Wire transfer only. Contact quickmoney247@gmail.com immediately - limited spots available!\n\nGuaranteed income! Start today!",
                    )
                  }
                >
                  <div>
                    <div className="font-medium text-destructive">High-Risk Scam Example</div>
                    <div className="text-sm text-muted-foreground">
                      Multiple red flags: upfront fees, unrealistic pay, urgency tactics
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent hover:bg-primary/5 border-primary/20"
                  onClick={() =>
                    setJobText(
                      "Software Engineer - React Developer\n\nTechCorp Inc. is seeking a skilled React developer to join our growing team in San Francisco. We're an established fintech company with 200+ employees.\n\nRequirements:\n• 3+ years React experience\n• TypeScript knowledge\n• Team collaboration skills\n• Portfolio required\n\nWe offer competitive salary ($90k-120k), health benefits, 401k matching, and flexible remote work options. Please apply through our careers page at techcorp.com/careers or contact our HR department.\n\nBackground check and references required.",
                    )
                  }
                >
                  <div>
                    <div className="font-medium text-primary">Legitimate Job Example</div>
                    <div className="text-sm text-muted-foreground">
                      Clear requirements, established company, professional process
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent hover:bg-yellow-500/5 border-yellow-500/20"
                  onClick={() =>
                    setJobText(
                      "Marketing Assistant - Remote Work Available\n\nJoin our team! Flexible hours, work from home opportunity. Earn good money with minimal effort. Contact us at info@bestjobs.net for quick start.\n\nNo experience necessary but must be motivated. Send resume and personal details including SSN for background verification.",
                    )
                  }
                >
                  <div>
                    <div className="font-medium text-yellow-600">Medium-Risk Example</div>
                    <div className="text-sm text-muted-foreground">
                      Mixed signals: some legitimate aspects but concerning elements
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {companyStats && (
              <CompanyStatsCard
                companyName={companyStats.companyName}
                followers={companyStats.followers}
                employees={companyStats.employees}
                engagement={companyStats.engagement}
                found={companyStats.found}
              />
            )}
            {result ? (
              <JobAnalysisResult result={result} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground text-pretty">
                    Paste a job posting and click "Analyze Job" to get started, or try one of the examples
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Built for Google AI Hackathon - Protecting job seekers from scams
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Fast Analysis
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                AI Powered
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Scam Detection
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
