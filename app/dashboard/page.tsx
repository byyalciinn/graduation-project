import { ModernDashboardLayout } from "@/components/layout/modern-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckSquare, Activity, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      description: "+12% from last month",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Tasks",
      value: "145",
      description: "+8% from last week",
      icon: CheckSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Activity",
      value: "89%",
      description: "+2% from yesterday",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Growth",
      value: "+23%",
      description: "Compared to last quarter",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New user registered
                      </p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <p className="text-sm font-medium">Add New User</p>
                  <p className="text-xs opacity-90">Create a new user account</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">Create Task</p>
                  <p className="text-xs text-muted-foreground">Add a new task to the system</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">View Reports</p>
                  <p className="text-xs text-muted-foreground">Access analytics and reports</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernDashboardLayout>
  )
}
