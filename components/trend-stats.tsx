"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface TrendData {
  totalAnalyzed: number
  scamCount: number
  scamRate: number
  recentAnalyses: Array<{ isScam: boolean; timestamp: number }>
}

export function TrendStats() {
  const [trendData, setTrendData] = useState<TrendData>({
    totalAnalyzed: 0,
    scamCount: 0,
    scamRate: 0,
    recentAnalyses: [],
  })

  useEffect(() => {
    // Get trend data from localStorage
    const stored = localStorage.getItem("job-scam-trends")
    if (stored) {
      setTrendData(JSON.parse(stored))
    }
  }, [])

  const updateTrends = (isScam: boolean) => {
    const newAnalysis = { isScam, timestamp: Date.now() }
    const updated = {
      totalAnalyzed: trendData.totalAnalyzed + 1,
      scamCount: trendData.scamCount + (isScam ? 1 : 0),
      scamRate: 0,
      recentAnalyses: [...trendData.recentAnalyses.slice(-9), newAnalysis],
    }
    updated.scamRate = Math.round((updated.scamCount / updated.totalAnalyzed) * 100)

    setTrendData(updated)
    localStorage.setItem("job-scam-trends", JSON.stringify(updated))
  }

  // Expose update function globally
  useEffect(() => {
    ;(window as any).updateTrendStats = updateTrends
  }, [trendData])

  if (trendData.totalAnalyzed === 0) return null

  const recentScams = trendData.recentAnalyses.filter((a) => a.isScam).length
  const recentTotal = trendData.recentAnalyses.length

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Live Scam Detection Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{recentScams}</div>
            <div className="text-sm text-muted-foreground">of last {recentTotal} flagged scam</div>
            <div className="flex justify-center mt-2">
              {trendData.recentAnalyses.slice(-10).map((analysis, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full mx-0.5 ${analysis.isScam ? "bg-destructive" : "bg-primary"}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">{trendData.scamRate}%</div>
            <div className="text-sm text-muted-foreground">Overall scam rate</div>
            <Progress value={trendData.scamRate} className="mt-2" />
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{trendData.totalAnalyzed}</div>
            <div className="text-sm text-muted-foreground">Total jobs analyzed</div>
            <div className="flex justify-center items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Protected job seekers
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
