"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/hooks/use-api"
import type { ContactSubmission } from "@/lib/types"

const InquiryCard = ({
  inquiry,
  onStatusChange,
  onDelete,
}: {
  inquiry: ContactSubmission
  onStatusChange: (id: string, status: ContactSubmission["status"]) => void
  onDelete: (id: string) => void
}) => {
  const getStatusColor = (status: ContactSubmission["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: ContactSubmission["type"]) => {
    switch (type) {
      case "general":
        return "bg-gray-100 text-gray-800"
      case "property-inquiry":
        return "bg-purple-100 text-purple-800"
      case "viewing-request":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-base">{inquiry.name}</h3>
            <p className="text-gray-600 text-xs">{inquiry.email}</p>
            <p className="text-gray-500 text-xs">{inquiry.phone}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-2 py-1 rounded-full text-2xs font-medium ${getStatusColor(inquiry.status)}`}>
              {inquiry.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-2xs font-medium ${getTypeColor(inquiry.type)}`}>
              {inquiry.type.replace("-", " ")}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-700">{inquiry.message}</p>
        </div>

        {inquiry.propertyId && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-xs font-medium text-gray-600">Property ID: {inquiry.propertyId}</p>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>Submitted: {new Date(inquiry.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex space-x-2">
          <select
            value={inquiry.status}
            onChange={(e) => onStatusChange(inquiry.id, e.target.value as ContactSubmission["status"])}
            className="flex-1 px-2 py-1 border rounded text-xs"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <Button size="sm" variant="destructive" onClick={() => onDelete(inquiry.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const InquiryStats = ({ inquiries }: { inquiries: ContactSubmission[] }) => {
  const totalInquiries = inquiries.length
  const newInquiries = inquiries.filter((i) => i.status === "new").length
  const contactedInquiries = inquiries.filter((i) => i.status === "contacted").length
  const closedInquiries = inquiries.filter((i) => i.status === "closed").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{totalInquiries}</div>
          <div className="text-xs text-gray-600">Total Inquiries</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-blue-600">{newInquiries}</div>
          <div className="text-xs text-gray-600">New</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-yellow-600">{contactedInquiries}</div>
          <div className="text-xs text-gray-600">Contacted</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-green-600">{closedInquiries}</div>
          <div className="text-xs text-gray-600">Closed</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/contact-submissions")
      if (response.ok) {
        const data = await response.json()
        setInquiries(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "All" || inquiry.type === filterType
    const matchesStatus = filterStatus === "All" || inquiry.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleStatusChange = async (id: string, status: ContactSubmission["status"]) => {
    try {
      // Update locally first for immediate feedback
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)))

      // In a real app, you'd call an API to update the status
      // await api.updateContactSubmission(id, { status })
    } catch (error) {
      console.error("Failed to update inquiry status:", error)
      // Revert the local change on error
      await fetchInquiries()
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        // Update locally first for immediate feedback
        setInquiries(inquiries.filter((i) => i.id !== id))

        // In a real app, you'd call an API to delete the inquiry
        // await api.deleteContactSubmission(id)
      } catch (error) {
        console.error("Failed to delete inquiry:", error)
        // Revert the local change on error
        await fetchInquiries()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading inquiries...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="text-gray-600">Manage customer inquiries and support requests</p>
      </div>

      <InquiryStats inquiries={inquiries} />

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search inquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="p-2 border rounded">
          <option value="All">All Types</option>
          <option value="general">General</option>
          <option value="property-inquiry">Property Inquiry</option>
          <option value="viewing-request">Viewing Request</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
          <option value="All">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInquiries.map((inquiry) => (
          <InquiryCard
            key={inquiry.id}
            inquiry={inquiry}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteInquiry}
          />
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">No inquiries found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
