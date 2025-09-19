import { type NextRequest, NextResponse } from "next/server"

interface CompanyStats {
  followers: number
  employees: number
  engagement: number
  found: boolean
  companyName: string
}

// Mock company data - in production this would be from a database
const companyData = [
  { company: "Infosys", followers: 5000000, employees: 340000, engagement: 12000 },
  { company: "TCS", followers: 4000000, employees: 300000, engagement: 10000 },
  { company: "Microsoft", followers: 15000000, employees: 220000, engagement: 45000 },
  { company: "Google", followers: 25000000, employees: 180000, engagement: 80000 },
  { company: "Apple", followers: 30000000, employees: 164000, engagement: 95000 },
  { company: "Amazon", followers: 20000000, employees: 1500000, engagement: 60000 },
  { company: "Meta", followers: 22000000, employees: 86000, engagement: 70000 },
  { company: "Netflix", followers: 18000000, employees: 15000, engagement: 35000 },
  { company: "Tesla", followers: 12000000, employees: 140000, engagement: 40000 },
  { company: "Spotify", followers: 8000000, employees: 9000, engagement: 15000 },
  { company: "Uber", followers: 5000000, employees: 32000, engagement: 8000 },
  { company: "Airbnb", followers: 4500000, employees: 6800, engagement: 7500 },
  { company: "Dropbox", followers: 2000000, employees: 3000, engagement: 3500 },
  { company: "Slack", followers: 1500000, employees: 2500, engagement: 2800 },
  { company: "Zoom", followers: 3000000, employees: 8000, engagement: 5500 },
  { company: "Adobe", followers: 4000000, employees: 28000, engagement: 6500 },
  { company: "Salesforce", followers: 6000000, employees: 79000, engagement: 9500 },
  { company: "Oracle", followers: 3500000, employees: 143000, engagement: 5000 },
  { company: "IBM", followers: 2500000, employees: 350000, engagement: 4000 },
  { company: "Intel", followers: 2800000, employees: 121000, engagement: 4200 },
  { company: "RandomStartup", followers: 80, employees: 5, engagement: 2 },
  { company: "TechStartup2023", followers: 150, employees: 12, engagement: 8 },
  { company: "NewCompany", followers: 45, employees: 3, engagement: 1 },
  { company: "SmallBiz", followers: 200, employees: 8, engagement: 15 },
  { company: "LocalTech", followers: 90, employees: 6, engagement: 3 },
  { company: "FakeLtd", followers: 10, employees: 1, engagement: 0 },
  { company: "ScamCorp", followers: 25, employees: 2, engagement: 1 },
  { company: "PhantomTech", followers: 5, employees: 1, engagement: 0 },
  { company: "QuickMoney", followers: 15, employees: 1, engagement: 0 },
  { company: "FakeJobs", followers: 8, employees: 1, engagement: 0 },
]

function extractCompanyName(input: string): string {
  // Handle LinkedIn URLs
  if (input.includes("linkedin.com/company/")) {
    const match = input.match(/linkedin\.com\/company\/([^/?]+)/)
    if (match) {
      return match[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  // Handle regular company names
  return input.trim()
}

function generateMockStats(): { followers: number; employees: number; engagement: number } {
  // Generate small random values that look scammy
  return {
    followers: Math.floor(Math.random() * 50) + 5, // 5-55
    employees: Math.floor(Math.random() * 5) + 1, // 1-6
    engagement: Math.floor(Math.random() * 3), // 0-2
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyInput } = await request.json()

    if (!companyInput || companyInput.trim() === "") {
      return NextResponse.json(
        {
          error: "Company name or URL is required",
        },
        { status: 400 },
      )
    }

    const companyName = extractCompanyName(companyInput)

    // Look up company in our mock dataset
    const company = companyData.find((c) => c.company.toLowerCase() === companyName.toLowerCase())

    if (company) {
      return NextResponse.json({
        followers: company.followers,
        employees: company.employees,
        engagement: company.engagement,
        found: true,
        companyName: company.company,
      })
    } else {
      // Generate mock stats for unknown companies (looks scammy)
      const mockStats = generateMockStats()
      return NextResponse.json({
        followers: mockStats.followers,
        employees: mockStats.employees,
        engagement: mockStats.engagement,
        found: false,
        companyName: companyName,
      })
    }
  } catch (error) {
    console.error("Error in company stats API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch company stats",
      },
      { status: 500 },
    )
  }
}
