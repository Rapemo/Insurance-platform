import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskVisualizer } from "@/components/risk-visualizer"
import { PolicyOverview } from "@/components/policy-overview"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentClaims } from "@/components/recent-claims"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72/100</div>
                  <p className="text-xs text-muted-foreground">Good - Improved by 5 points</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$349.99</div>
                  <p className="text-xs text-muted-foreground">Due in 15 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Processing since May 5</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Policy Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PolicyOverview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Claims</CardTitle>
                  <CardDescription>Your recent claim activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentClaims />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="risk" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>AI-powered risk assessment based on your profile and policies</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RiskVisualizer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

