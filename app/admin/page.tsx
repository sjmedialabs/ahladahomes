"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import type { Property, Lead, User } from "@/lib/types"

const StatsCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-green-600">{change}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </CardContent>
  </Card>
)

const RecentActivity = ({ activities }: { activities: any[] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead":
        return "🎯"
      case "property":
        return "🏠"
      case "agent":
        return "👤"
      default:
        return "📝"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id || Math.random()} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                  <p className="text-2xs text-gray-500">
                   {activity.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const canViewAll = user?.role === "super_admin"
  const canManageAll = user?.role === "super_admin"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch properties
        const propertiesRes = await fetch("/api/properties")
        const propertiesData = await propertiesRes.json()
        // Ensure it's an array
        const allProperties = Array.isArray(propertiesData) ? propertiesData : propertiesData.data ?? []
        setProperties(allProperties)
        console.log("Fetched properties:", allProperties)
        // Fetch leads
        const leadsRes = await fetch("/api/leads")
        const leadsData = await leadsRes.json()
        const allLeads = Array.isArray(leadsData) ? leadsData : leadsData.data ?? []
        console.log("Fetched leads:", allLeads)

if (canViewAll) {
  setLeads(allLeads)
} else if (user?._id) {
  // Agent sees only their leads
  setLeads(
    allLeads)}
}

       catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // fallback to empty arrays to prevent crash
        setProperties([])
        setLeads([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, canViewAll])

  const stats = canViewAll
    ? [
        {
          title: "Total Leads",
          value: (leads?.length ?? 0).toString(),
          change: `${leads?.filter((l) => l.status === "new").length ?? 0} new`,
          icon: "🎯",
        },
        {
          title: "Properties",
          value: (properties?.length ?? 0).toString(),
          change: `${properties?.filter((p) => p.featured).length ?? 0} featured`,
          icon: "🏠",
        },
        {
          title: "High Priority Leads",
          value: (leads?.filter((l) => l.priority === "high").length ?? 0).toString(),
          change: "Needs attention",
          icon: "🚨",
        },
      ]
    : [
        {
          title: "My Leads",
          value: (leads?.length ?? 0).toString(),
          change: `${leads?.filter((l) => l.status === "new").length ?? 0} new`,
          icon: "🎯",
        },
        {
          title: "Contacted",
          value: (leads?.filter((l) => l.status === "contacted").length ?? 0).toString(),
          change: "In progress",
          icon: "📞",
        },
        {
          title: "Closed Deals",
          value: (leads?.filter((l) => l.status === "closed").length ?? 0).toString(),
          change: "Completed",
          icon: "✅",
        },
        {
          title: "High Priority",
          value: (leads?.filter((l) => l.priority === "high").length ?? 0).toString(),
          change: "Urgent",
          icon: "🚨",
        },
      ]

  const recentActivities = leads.slice(0, 4).map((lead) => ({
    id: lead.id,
    action: `New ${lead.priority} priority lead from ${lead.name}`,
    user: lead.assignedAgents && lead.assignedAgents?.length
      ? lead.assignedAgents[0]?.name || "Unassigned"
      : "Unassigned",
    time: new Date(lead.createdAt).toLocaleDateString(),
    type: "lead",
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{canViewAll ? "Super Admin Dashboard" : "Agent Dashboard"}</h1>
        <p className="text-gray-600">
          {canViewAll
            ? "Manage all leads, agents, and properties from here."
            : "Track your leads and manage your assigned properties."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} />
        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => (window.location.href = "/admin/leads")}
                className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <div className="text-xl mb-2">🎯</div>
                <div className="text-xs font-medium">Manage Leads</div>
              </button>
              {canManageAll && (
                <button
                  onClick={() => (window.location.href = "/admin/settings")}
                  className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <div className="text-xl mb-2">👥</div>
                  <div className="text-xs font-medium">Manage Web Content</div>
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/admin/properties")}
                className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <div className="text-xl mb-2">🏠</div>
                <div className="text-xs font-medium">View Properties</div>
              </button>
              {canViewAll && (
                <button
                  onClick={() => (window.location.href = "/admin/analytics")}
                  className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <div className="text-xl mb-2">📊</div>
                  <div className="text-xs font-medium">View Analytics</div>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
