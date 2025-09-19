import { type NextRequest, NextResponse } from "next/server"

// Scam keywords and patterns
const SCAM_KEYWORDS = [
  "work from home",
  "earn $",
  "quick money",
  "no experience needed",
  "processing fee",
  "upfront payment",
  "wire transfer",
  "western union",
  "urgent hiring",
  "immediate start",
  "guaranteed income",
  "easy money",
  "pyramid scheme",
  "multi-level marketing",
  "mlm",
  "investment opportunity",
  "cash advance",
  "credit check required",
  "social security number",
  "bank account details",
  "personal information required",
]

const LEGITIMATE_INDICATORS = [
  "competitive salary",
  "health benefits",
  "company website",
  "established company",
  "specific requirements",
  "team collaboration",
  "professional development",
  "career growth",
  "office location",
  "hr department",
  "interview process",
  "portfolio required",
  "references needed",
  "background check",
]

const HIGH_RISK_PATTERNS = [
  /\$\d+[,\d]*\s*(per|\/)\s*(week|day|hour)/i, // Unrealistic pay promises
  /earn.*\$\d+.*week/i,
  /no.*experience.*needed/i,
  /send.*\$\d+/i, // Upfront fees
  /wire.*transfer/i,
  /urgent.*hiring/i,
  /immediate.*start/i,
  /guaranteed.*income/i,
]

const SCAM_PERSONALITIES = {
  "Quick Money Hustler": {
    emoji: "💸",
    description: "This ad is promising unrealistic fast cash. Classic get-rich-quick scam.",
    triggers: ["quick money", "earn $", "easy money", "guaranteed income", "fast cash"],
  },
  "Phantom Employer": {
    emoji: "👻",
    description: "Tiny or fake company profile, barely any followers — looks like it's hiring from thin air.",
    triggers: ["no company", "brief description", "no website"],
  },
  "Shady Recruiter": {
    emoji: "🕶️",
    description:
      "The description asks you to connect via Gmail/Telegram/WhatsApp — very suspicious recruiter behavior.",
    triggers: ["@gmail.com", "@yahoo.com", "telegram", "whatsapp", "personal email"],
  },
  "Fee Collector": {
    emoji: "🎯",
    description: "Asking for upfront payments or processing fees — legitimate employers never charge candidates.",
    triggers: ["processing fee", "upfront payment", "wire transfer", "send $"],
  },
  "Data Harvester": {
    emoji: "🎣",
    description: "Fishing for personal information like SSN or bank details — major red flag for identity theft.",
    triggers: ["social security", "bank account", "personal information", "ssn"],
  },
  "Urgency Manipulator": {
    emoji: "⏰",
    description: "Creating false urgency with 'immediate start' and 'limited spots' — classic pressure tactics.",
    triggers: ["urgent hiring", "immediate start", "limited spots", "act now"],
  },
}

function getScamPersonality(
  foundKeywords: string[],
  companyFlags: string[],
  text: string,
): { type: string; emoji: string; description: string } | null {
  const lowerText = text.toLowerCase()

  for (const [personality, data] of Object.entries(SCAM_PERSONALITIES)) {
    const hasMatch = data.triggers.some(
      (trigger) =>
        foundKeywords.some((keyword) => keyword.includes(trigger)) ||
        companyFlags.some((flag) => flag.toLowerCase().includes(trigger)) ||
        lowerText.includes(trigger),
    )

    if (hasMatch) {
      return {
        type: personality,
        emoji: data.emoji,
        description: data.description,
      }
    }
  }

  return null
}

function createHeatmapData(
  jobText: string,
  foundKeywords: string[],
): Array<{ word: string; start: number; end: number; type: "scam" | "legit" }> {
  const heatmapData: Array<{ word: string; start: number; end: number; type: "scam" | "legit" }> = []
  const lowerText = jobText.toLowerCase()

  // Find scam keywords positions
  foundKeywords.forEach((keyword) => {
    let startIndex = 0
    while (true) {
      const index = lowerText.indexOf(keyword.toLowerCase(), startIndex)
      if (index === -1) break

      heatmapData.push({
        word: keyword,
        start: index,
        end: index + keyword.length,
        type: "scam",
      })
      startIndex = index + 1
    }
  })

  // Find legitimate indicators positions
  LEGITIMATE_INDICATORS.forEach((indicator) => {
    if (lowerText.includes(indicator.toLowerCase())) {
      let startIndex = 0
      while (true) {
        const index = lowerText.indexOf(indicator.toLowerCase(), startIndex)
        if (index === -1) break

        heatmapData.push({
          word: indicator,
          start: index,
          end: index + indicator.length,
          type: "legit",
        })
        startIndex = index + 1
      }
    }
  })

  return heatmapData.sort((a, b) => a.start - b.start)
}

function analyzeJobPosting(jobText: string) {
  const text = jobText.toLowerCase()

  // Find scam keywords
  const foundScamKeywords = SCAM_KEYWORDS.filter((keyword) => text.includes(keyword.toLowerCase()))

  // Find legitimate indicators
  const foundLegitimateIndicators = LEGITIMATE_INDICATORS.filter((indicator) => text.includes(indicator.toLowerCase()))

  // Check high-risk patterns
  const highRiskMatches = HIGH_RISK_PATTERNS.filter((pattern) => pattern.test(jobText))

  // Calculate risk score
  let riskScore = 0

  // Add points for scam indicators
  riskScore += foundScamKeywords.length * 15
  riskScore += highRiskMatches.length * 25

  // Subtract points for legitimate indicators
  riskScore -= foundLegitimateIndicators.length * 10

  // Additional risk factors
  if (text.includes("@gmail.com") || text.includes("@yahoo.com")) {
    riskScore += 10
  }

  if (text.length < 100) {
    riskScore += 15 // Very short job postings are suspicious
  }

  if (!text.includes("company") && !text.includes("corp") && !text.includes("inc")) {
    riskScore += 10 // No clear company name
  }

  // Cap the risk score
  riskScore = Math.max(0, Math.min(100, riskScore))

  // Determine if it's likely a scam
  const isScam = riskScore >= 60

  // Calculate confidence based on number of indicators found
  const totalIndicators = foundScamKeywords.length + foundLegitimateIndicators.length + highRiskMatches.length
  const confidence = Math.min(95, Math.max(60, 60 + totalIndicators * 8))

  // Generate company flags
  const companyFlags = []
  if (text.includes("@gmail.com") || text.includes("@yahoo.com")) {
    companyFlags.push("Uses personal email domain")
  }
  if (!text.includes("website") && !text.includes(".com")) {
    companyFlags.push("No company website mentioned")
  }
  if (text.length < 100) {
    companyFlags.push("Very brief job description")
  }

  // Generate explanation
  let explanation = ""
  if (riskScore >= 70) {
    explanation = `This job posting shows multiple red flags indicating it's likely a scam. Key concerns include ${foundScamKeywords.length} scam-related keywords and ${highRiskMatches.length} high-risk patterns. Be extremely cautious and avoid sharing personal information or making any payments.`
  } else if (riskScore >= 40) {
    explanation = `This job posting has some concerning elements that warrant caution. While it may be legitimate, the presence of ${foundScamKeywords.length} potential warning signs suggests you should research the company thoroughly before proceeding.`
  } else {
    explanation = `This job posting appears relatively legitimate with ${foundLegitimateIndicators.length} positive indicators and minimal red flags. However, always verify company details and never provide sensitive information until you've confirmed the opportunity is genuine.`
  }

  const personality = isScam ? getScamPersonality(foundScamKeywords, companyFlags, jobText) : null
  const heatmapData = createHeatmapData(jobText, foundScamKeywords)

  return {
    isScam,
    confidence,
    riskScore,
    scamKeywords: foundScamKeywords,
    legitimateIndicators: foundLegitimateIndicators,
    companyFlags,
    explanation,
    personality,
    heatmapData,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { jobText } = await request.json()

    if (!jobText || typeof jobText !== "string") {
      return NextResponse.json({ error: "Job text is required" }, { status: 400 })
    }

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const result = analyzeJobPosting(jobText)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze job posting" }, { status: 500 })
  }
}
