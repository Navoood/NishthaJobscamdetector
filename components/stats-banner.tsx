import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Users, TrendingUp } from "lucide-react"

export function StatsBanner() {
  const stats = [
    {
      icon: Shield,
      value: "95%",
      label: "Accuracy Rate",
      description: "Proven detection accuracy",
    },
    {
      icon: Zap,
      value: "<5s",
      label: "Analysis Time",
      description: "Lightning fast results",
    },
    {
      icon: Users,
      value: "1000+",
      label: "Jobs Analyzed",
      description: "Helping job seekers stay safe",
    },
    {
      icon: TrendingUp,
      value: "24/7",
      label: "Available",
      description: "Always ready to help",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center">
          <CardContent className="p-4">
            <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm font-medium">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
