"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import type { Lead, User } from "@/lib/types"

const LeadCard = ({
  lead,
  onStatusChange,
  onPriorityChange,
  onAddNote,
  onDelete,
  canManageAll,
}: {
  lead: Lead
  onStatusChange: (id: string, status: Lead["status"]) => void
  onPriorityChange: (id: string, priority: Lead["priority"]) => void
  onAddNote: (id: string, note: string) => void
  onDelete: (id: string) => void
  canManageAll: boolean
}) => {
  const [newNote, setNewNote] = useState("")
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
    const [showAllNotes, setShowAllNotes] = useState(false);


  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(lead.id, newNote.trim())
      setNewNote("")
      setShowNoteForm(false)
    }
  }

  const getStatusColor = (status: Lead["status"]) => {
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

  const getPriorityColor = (priority: Lead["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="overflow-hidden" key={lead._id}>
      <CardContent className="p-6">
        {/* Lead info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-base capitalize">{lead.name}</h3>
            <p className="text-gray-600 text-xs">{lead.email}</p>
            <p className="text-gray-500 text-xs">{lead.phone || "N/A"}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <span
              className={`px-2 py-1 rounded-full text-2xs font-medium ${getStatusColor(
                lead.status
              )}`}
            >
              {lead.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-2xs font-medium ${getPriorityColor(
                lead.priority
              )}`}
            >
              {lead.priority} priority
            </span>
          </div>
        </div>

        {/* Lead message */}
        <div className="mb-4">
          <p className="text-xs text-gray-700">{lead.message || "No message"}</p>
        </div>

        {/* Property info */}
      {lead.propertyId && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-xs font-medium text-gray-600">
            Property:{" "}
            {typeof lead.propertyId === "string"
              ? lead.propertyId
              : typeof lead.propertyId === "object" && lead.propertyId !== null && "title" in lead.propertyId && "type" in lead.propertyId
                ? `${(lead.propertyId as { title?: string; type?: string }).title || "N/A"} (${(lead.propertyId as { title?: string; type?: string }).type || "N/A"})`
                : "N/A"}
          </p>
        </div>
      )}

        {/* Source */}
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-xs font-medium text-gray-600">
            Source:{" "}
            <span className="capitalize">{lead.source.replace("_", " ")}</span>
          </p>
        </div>
        {/* Notes */}
        {lead.notes && lead.notes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Notes:</h4>
            <div className="space-y-1 line-clamp-2">
              {lead.notes.slice(0,3).map((note, index) => (
                            <div key={index} className="relative">
                {/* Show 2 lines with ellipsis */}
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                  {note}
                </p>

                {/* Show Read more if note is longer */}
                {note.split(" ").length > 20 && (
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="text-blue-600 text-xs mt-1"
                  >
                    Read more
                  </button>
                )}
              </div>
              
              ))}
         
            </div>
              {lead.notes.length > 3 && (
              <button
                onClick={() => setShowAllNotes(true)}
                className="text-blue-600 text-xs mt-1"
              >
                View All Notes
              </button>
            )}
          </div>
        )}
          {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <h4 className="text-sm font-semibold mb-4">Note Details</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{selectedNote}</p>
            <button
              onClick={() => setSelectedNote(null)}
              className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
            {/* Modal to show all notes */}
      {showAllNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <h4 className="text-sm font-semibold mb-4">All Notes</h4>
            <div className="space-y-2">
              {lead.notes.map((note, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-line"
                >
                  {note}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowAllNotes(false)}
              className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
        {/* Assigned Agents */}
        {lead.assignedAgents && (lead.assignedAgents || []).length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Assigned Agents:</p>
            <div className="flex flex-wrap gap-1">
              {(lead.assignedAgents || []).map((a: any) => (
                <span
                  key={`agent-${a._id}`}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize"
                >
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status & Priority */}
        <div className="flex space-x-2 mb-3">
          <select
            value={lead.status}
            onChange={(e) =>
              onStatusChange(lead._id || lead.id, e.target.value as Lead["status"])
            }
            className="flex-1 px-2 py-1 border rounded text-xs"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={lead.priority}
            onChange={(e) =>
              onPriorityChange(lead._id || lead.id, e.target.value as Lead["priority"])
            }
            className="flex-1 px-2 py-1 border rounded text-xs"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Add note & delete buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="flex-1"
          >
            Add Note
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(lead._id || lead.id)}>
            Delete
          </Button>
        </div>

        {/* Note form */}
        {showNoteForm && (
          <div className="space-y-2 mt-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full p-2 border rounded text-xs"
              rows={2}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddNote}>
                Save Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNoteForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
// Stats component unchanged
const LeadStats = ({ leads }: { leads: Lead[] }) => {
  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === "new").length
  const contactedLeads = leads.filter((l) => l.status === "contacted").length
  const closedLeads = leads.filter((l) => l.status === "closed").length
  const highPriorityLeads = leads.filter((l) => l.priority === "high").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{totalLeads}</div>
          <div className="text-xs text-gray-600">Total Leads</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-blue-600">{newLeads}</div>
          <div className="text-xs text-gray-600">New</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-yellow-600">{contactedLeads}</div>
          <div className="text-xs text-gray-600">Contacted</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-green-600">{closedLeads}</div>
          <div className="text-xs text-gray-600">Closed</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-red-600">{highPriorityLeads}</div>
          <div className="text-xs text-gray-600">High Priority</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main page with API integration
export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("All")
  const [filterPriority, setFilterPriority] = useState<string>("All")

  const canManageAll = user?.role === "super_admin"

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)

      // 1️⃣ Fetch all leads
      const leadsRes = await fetch("/api/leads")
      const leadsData = await leadsRes.json()
      if (!leadsData.success || !Array.isArray(leadsData.data)) {
        setLeads([])
        return
      }

      // 2️⃣ Fetch all agents (optional)
      const agentsRes = await fetch("/api/agents")
      const agentsData = await agentsRes.json()
      setAgents(agentsData.success ? agentsData.data.filter((a: User) => a.role === "agent") : [])

      // 3️⃣ Normalize leads
      let fetchedLeads: Lead[] = leadsData.data.map((lead: any) => ({
        ...lead,
        id: lead.id || lead._id?.toString() || crypto.randomUUID(),
        notes: lead.notes || [],
        assignedAgents: lead.assignedAgents || [], // keep as objects
      }))

      // 4️⃣ Role-based filtering
      if (!canManageAll && user?.id) {
        fetchedLeads = fetchedLeads.filter((l) =>
          l.assignedAgents.some((a) => a._id === user.id)
        )
      }

      setLeads(fetchedLeads)
    } catch (error) {
      console.error("Failed to fetch leads:", error)
      setLeads([])
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  // 5️⃣ Lead update handlers
  const updateLead = async (id: string, update: Partial<Lead>) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      })
      const data = await res.json()
      if (data.success) fetchData()
      else alert("Failed to update lead")
    } catch (error) {
      console.error(error)
      alert("Failed to update lead")
    }
  }

  const handleStatusChange = (id: string, status: Lead["status"]) =>
    updateLead(id, { status })
  const handlePriorityChange = (id: string, priority: Lead["priority"]) =>
    updateLead(id, { priority })
  const handleAddNote = (id: string, note: string) => {
    const lead = leads.find((l) => l.id === id)
    if (lead) {
      const updatedNotes = [...lead.notes, `${new Date().toLocaleDateString()}: ${note}`]
      updateLead(id, { notes: updatedNotes })
    }
  }
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
      else alert("Failed to delete lead")
    } catch (error) {
      console.error(error)
      alert("Failed to delete lead")
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading leads...</div>
      </div>
    )

  // 6️⃣ Filtered leads by search, status, priority
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || lead.status === filterStatus
    const matchesPriority = filterPriority === "All" || lead.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-600">
          {canManageAll
            ? "Manage all leads and assign them to agents"
            : "Manage your assigned leads"}
        </p>
      </div>

      <LeadStats leads={leads} />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Priority</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Lead cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id || lead._id}
            lead={lead}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onAddNote={handleAddNote}
            onDelete={handleDeleteLead}
            canManageAll={canManageAll}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">No leads found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

