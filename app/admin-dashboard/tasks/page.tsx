import { ModernDashboardLayout } from "@/components/layout/modern-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: "Update user documentation",
      description: "Review and update the user guide with latest features",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-01-15",
      assignee: "John Doe",
    },
    {
      id: 2,
      title: "Fix login bug",
      description: "Resolve the authentication issue reported by users",
      status: "To Do",
      priority: "Critical",
      dueDate: "2024-01-10",
      assignee: "Jane Smith",
    },
    {
      id: 3,
      title: "Design new dashboard",
      description: "Create mockups for the new admin dashboard",
      status: "Completed",
      priority: "Medium",
      dueDate: "2024-01-08",
      assignee: "Bob Johnson",
    },
    {
      id: 4,
      title: "Database optimization",
      description: "Improve query performance for large datasets",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-01-20",
      assignee: "Alice Williams",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700"
      case "High":
        return "bg-orange-100 text-orange-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your tasks and projects
            </p>
          </div>
          <Button className="bg-green-700 hover:bg-green-800">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Search and filters */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks list */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>Track and manage your project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                          <span className="text-xs text-muted-foreground">Assigned to: {task.assignee}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  )
}
