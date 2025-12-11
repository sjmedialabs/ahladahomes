"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

// Metric Card Component
const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: string
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs ${getChangeColor()}`}>{change}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple Chart Component
const SimpleChart = ({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number; color?: string }[]
}) => {
  const maxValue = Math.max(...data.map((d) => d.value))
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-xs text-gray-600">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full ${item.color || "bg-red-500"}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-12 text-xs font-medium text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [properties, setProperties] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, agentRes, leadRes] = await Promise.all([
          fetch("/api/properties"),
          fetch("/api/agents"),
          fetch("/api/leads"),
        ])
        const [propData, agentData, leadData] = await Promise.all([
          propRes.json(),
          agentRes.json(),
          leadRes.json(),
        ])
        setProperties(propData.data || [])
        setLeads(leadData.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const filterByTimeRange = (items: any[], range: string) => {
  const now = new Date()
  let startDate: Date

  switch (range) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case "1y":
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      break
    default:
      startDate = new Date(0)
  }

  return items.filter((item) => {
    const date = new Date(item.createdAt)
    return date >= startDate && date <= now
  })
}


  // Date helpers for last month
  const now = new Date()
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const filterLastMonth = (items: any[]) =>
    items.filter((item) => {
      const date = new Date(item.createdAt)
      return date >= firstDayOfLastMonth && date <= lastDayOfLastMonth
    })
const filteredProperties = filterByTimeRange(properties, timeRange)
const filteredLeads = filterByTimeRange(leads, timeRange)

const totalProperties = filteredProperties.length
const totalLeads = filteredLeads.length
const soldProperties = filteredProperties.filter((p) => p.status === "sold").length
const rentedProperties = filteredProperties.filter((p) => p.status === "rented").length


  // Last month metrics
  const totalPropertiesLastMonth = filterLastMonth(properties).length
  const totalLeadsLastMonth = filterLastMonth(leads).length
  const soldPropertiesLastMonth = filterLastMonth(properties).filter((p) => p.status === "sold").length
  const rentedPropertiesLastMonth = filterLastMonth(properties).filter((p) => p.status === "rented").length

  const calcChange = (current: number, last: number) =>
    last > 0 ? Math.round(((current - last) / last) * 100) : current > 0 ? 100 : 0

  const metrics: {
    title: string
    value: string
    change: string
    changeType: "positive" | "negative" | "neutral"
    icon: string
  }[] = [
    {
      title: "Total Properties",
      value: totalProperties.toString(),
      change: `${calcChange(totalProperties, totalPropertiesLastMonth)}% from last month`,
      changeType: totalProperties >= totalPropertiesLastMonth ? "positive" : "negative",
      icon: "🏠",
    },
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      change: `${calcChange(totalLeads, totalLeadsLastMonth)}% from last month`,
      changeType: totalLeads >= totalLeadsLastMonth ? "positive" : "negative",
      icon: "📋",
    },
    {
      title: "Sold Properties",
      value: soldProperties.toString(),
      change: `${calcChange(soldProperties, soldPropertiesLastMonth)}% from last month`,
      changeType: soldProperties >= soldPropertiesLastMonth ? "positive" : "negative",
      icon: "✅",
    },
    {
      title: "Rented Properties",
      value: rentedProperties.toString(),
      change: `${calcChange(rentedProperties, rentedPropertiesLastMonth)}% from last month`,
      changeType: rentedProperties >= rentedPropertiesLastMonth ? "positive" : "negative",
      icon: "🏘️",
    },
  ]

  // Property type data
  const propertyTypeData = [
    {
      label: "Buy",
      value: properties.filter((p) => p.status === "for-sale").length,
      color: "bg-red-500",
    },
    {
      label: "Rent",
      value: properties.filter((p) => p.status === "for-rent").length,
      color: "bg-blue-500",
    },
  ]

  // Location data dynamically
  const locationData = (Array.from(
    properties.reduce((acc, p) => {
      const loc = p.location || "Unknown"
      acc.set(loc, (acc.get(loc) ?? 0) + 1)
      return acc
    }, new Map<string, number>())
  ) as [string, number][]).map(([loc, count], i) => ({
    label: loc,
    value: count,
    color: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"][i % 5],
  }))
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track your platform performance and insights</p>
        </div>
<select
  value={timeRange}
  onChange={(e) => setTimeRange(e.target.value)}
  className="p-2 border rounded bg-white"
>
  <option value="7d">Last 7 days</option>
  <option value="30d">Last 30 days</option>
  <option value="90d">Last 90 days</option>
  <option value="1y">Last year</option>
</select>

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart title="Property Type Distribution" data={propertyTypeData} />
        <SimpleChart title="Properties by Location" data={locationData} />
      </div>

      {/* Top Performing Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Leads */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">Recent Leads</h3>
            <div className="space-y-3">
              {leads
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{lead.name}</p>
                      <p className="text-xs text-gray-600">
                        {typeof lead.propertyId === "string"
              ? lead.propertyId
              : typeof lead.propertyId === "object" && lead.propertyId !== null && "title" in lead.propertyId && "type" in lead.propertyId
                ? `${(lead.propertyId as { title?: string; type?: string }).title || "N/A"} (${(lead.propertyId as { title?: string; type?: string }).type || "N/A"})`
                : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{lead.status || "-"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
