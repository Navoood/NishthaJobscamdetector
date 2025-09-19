import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, TrendingUp, AlertTriangle } from "lucide-react"

interface CompanyStatsCardProps {
  companyName: string
  followers: number
  employees: number
  engagement: number
  found: boolean
}

export function CompanyStatsCard({ companyName, followers, employees, engagement, found }: CompanyStatsCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getPresenceLevel = () => {
    if (!found || (followers < 100 && employees < 10)) {
      return { level: "Low", color: "destructive", icon: AlertTriangle }
    } else if (followers > 1000000 || employees > 10000) {
      return { level: "High", color: "default", icon: TrendingUp }
    } else {
      return { level: "Medium", color: "secondary", icon: Building2 }
    }
  }

  const presence = getPresenceLevel()
  const PresenceIcon = presence.icon

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Company Stats Found
          </CardTitle>
          <Badge variant={presence.color as any} className="flex items-center gap-1">
            <PresenceIcon className="h-3 w-3" />
            {presence.level} Presence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">{companyName}</div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(followers)}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Building2 className="h-4 w-4 text-green-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-green-600">{formatNumber(employees)}</div>
            <div className="text-xs text-muted-foreground">Employees</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatNumber(engagement)}</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        {!found && (
          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-4 w-4" />
              Low company presence detected - stats auto-generated
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
