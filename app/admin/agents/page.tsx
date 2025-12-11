"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User, Property } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import FileUpload from "@/components/file-upload"

type AgentCardProps = {
  agent: User
  onEdit: (agent: User) => void
  onStatusChange: (id: string, status: User["status"]) => void
  onDelete: (id: string) => void            // ✅ Missing in your render
  onAssignProperties: (agentId: string, propertyIds: string[]) => void  // ✅ Missing
  leadCount: number                          // ✅ Missing
}

export const AgentCard = ({
  agent,
  onEdit,
  onStatusChange,
  onDelete,
  onAssignProperties,
}: AgentCardProps) => {
  const [showPropertyAssignment, setShowPropertyAssignment] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState<string[]>(
    agent.assignedProperties?.map((p) => String(p)) || []
  )
  const [properties, setProperties] = useState<Property[]>([])

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties")
        const data = await res.json()
        setProperties(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        console.error("Failed to fetch properties:", err)
      }
    }
    fetchProperties()
  }, [])

 const handleDelete = async () => {
  console.log("Attempting to delete agent with ID:", agent.name);
 // if (!confirm(`Are you sure you want to delete agent ${agent.name}?`)) return;
  try {
    const res = await fetch(`/api/agents/${agent._id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete agent");
    }
    console.log("Agent after delete:", agent.name); // Check if this changes
    onDelete(agent._id);
  } catch (err) {
    console.error(err);
    alert(`Failed to delete agent: ${err}`);
  }
};


  // Save assignment to backend and update local state
  const handleSavePropertyAssignment = async () => {
    console.log("Saving property assignment for agent:", agent.name, selectedProperties)
    try {
      const res = await fetch(`/api/agents/${agent._id}/assign-properties`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyIds: selectedProperties }),
      })

      if (!res.ok) throw new Error("Failed to update properties")

      // Update local state instantly
      onAssignProperties(agent._id, selectedProperties)
      alert("Properties assigned successfully.");
      setShowPropertyAssignment(false)
    } catch (err) {
      console.error("Failed to assign properties:", err)
    }
  }

  // Compute titles of assigned properties
  const assignedPropertyTitles = properties
    .filter((p) => selectedProperties.includes(String(p._id)))
    .map((p) => p.title)

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  

  return (
    <Card>
      <CardContent className="p-6" key={agent._id}>
        {/* Agent Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
              {agent.avatar ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                agent.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <p className="text-gray-600 text-sm">{agent.email}</p>
              <p className="text-gray-500 text-sm">{agent.phone}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              agent.status
            )}`}
          >
            {agent.status}
          </span>
        </div>

        {/* Agent Bio */}
        {agent.agentInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{agent.agentInfo.bio}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Experience:</span>{" "}
                {agent.agentInfo.experience}
              </div>
              <div>
                <span className="font-medium">Languages:</span>{" "}
                {agent.agentInfo.languages.join(", ")}
              </div>
            </div>
            <div className="mt-2">
              <span className="font-medium text-sm">Specialties:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {agent.agentInfo.specialties.map((s) => (
                  <span
                    key={`${agent._id}-specialty-${s}`}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {/* <div>
            <p className="text-gray-500">Assigned Properties</p>
            <p className="font-medium">{selectedProperties.length}</p>
          </div> */}
          {/* <div>
            <p className="text-gray-500">Active Leads</p>
            <p className="font-medium">{leadCount}</p>
          </div> */}
          <div>
            <p className="text-gray-500">Joined</p>
            <p className="font-medium">
              {new Date(agent.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* <div>
            <p className="text-gray-500">Last Login</p>
            <p className="font-medium">
              {agent.lastLogin
                ? new Date(agent.lastLogin).toLocaleDateString()
                : "Never"}
            </p>
          </div> */}
        </div>

        {/* Assigned Properties */}
        {assignedPropertyTitles.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Assigned Properties:
            </p>
            <div className="flex flex-wrap gap-1">
              {assignedPropertyTitles.map((title) => (
                <span
                  key={`${agent._id}-assigned-${title}`}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => onEdit(agent)} className="flex-1">
              Edit
            </Button>
            <select
              value={agent.status}
              onChange={(e) =>
                onStatusChange(agent._id, e.target.value as User["status"])
              }
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPropertyAssignment(true)}
              className="flex-1"
            >
              Assign Properties
            </Button>
           <Button
                size="sm"
                variant="destructive"
                onClick={()=> onDelete(agent._id)}
              >
                Delete
              </Button>
          </div>
        </div>

        {/* Property Assignment Modal */}
{showPropertyAssignment && (
  <div className="mt-4 p-4 border rounded bg-gray-50">
    <h4 className="font-medium mb-3">Assign Properties</h4>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {(properties ?? []).map((p) => {
        const propertyId = String(p._id);
        const isChecked = selectedProperties.includes(propertyId);
        return (
          <label
            key={`property-${propertyId}`}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...selectedProperties, propertyId]
                  : selectedProperties.filter((id) => id !== propertyId);
                setSelectedProperties(updated);
              }}
            />
            <span className="text-sm">{p.title}</span>
          </label>
        );
      })}
    </div>
    <div className="flex space-x-2 mt-3">
      <Button size="sm" onClick={handleSavePropertyAssignment}>
        Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowPropertyAssignment(false)}
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

// ---------------- Agent Form

interface AgentFormProps {
  agent?: User
  onCancel: () => void
  onSuccess?: (updatedAgent: User) => void
}

// Define a strict form data type where agentInfo is always present
interface AgentFormData {
  name: string
  email: string
  phone: string
  password?: string
  status: User["status"]
  role: "agent"
  agentInfo: {
    specialties: string[]
    experience: string
    languages: string[]
    bio: string
    image?: string
  }
}

export const AgentForm = ({ agent, onCancel, onSuccess }: AgentFormProps) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "active",
    role: "agent",
    agentInfo: { specialties: [], experience: "", languages: [], bio: "" , image: ""},
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [loading, setLoading] = useState(false)

  // Prefill form if editing
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        email: agent.email || "",
        phone: agent.phone || "",
        password: "",
        status: agent.status || "active",
        role: "agent",
        agentInfo: {
          specialties: agent.agentInfo?.specialties || [],
          experience: agent.agentInfo?.experience || "",
          languages: agent.agentInfo?.languages || [],
          bio: agent.agentInfo?.bio || "",
          image: agent.agentInfo?.image,
        },
      })
    }
  }, [agent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
      // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic valid email pattern
  if (!formData.email || !emailRegex.test(formData.email.trim())) {
    alert("Please enter a valid email address (e.g., name@example.com).");
    setLoading(false);
    return;
  }

    try {
      const payload = { ...formData }
      if (agent && !formData.password) delete payload.password

      const res = await fetch(agent ? `/api/agents/${agent._id}` : "/api/agents", {
        method: agent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save agent")
      const updatedAgent: User = await res.json()
      onSuccess?.(updatedAgent)
      alert("Agent saved successfully.");
      onCancel()
    } catch (err) {
      console.error(err)
      alert("Failed to save agent. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const addSpecialty = () => {
    const specialty = newSpecialty.trim()
    if (specialty && !formData.agentInfo.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        agentInfo: {
          ...formData.agentInfo,
          specialties: [...formData.agentInfo.specialties, specialty],
        },
      })
      setNewSpecialty("")
    }
  }

  const addLanguage = () => {
    const language = newLanguage.trim()
    if (language && !formData.agentInfo.languages.includes(language)) {
      setFormData({
        ...formData,
        agentInfo: {
          ...formData.agentInfo,
          languages: [...formData.agentInfo.languages, language],
        },
      })
      setNewLanguage("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{agent ? "Edit Agent" : "Add New Agent"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
                  {/* --- Profile Image Upload --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image</label>
        <FileUpload
          value={formData.agentInfo.image || ""}
          onChange={(url) =>
            setFormData({
              ...formData,
              agentInfo: { ...formData.agentInfo, image: url },
            })
          }
          accept="image/*"
          placeholder="Upload profile image or drag & drop"
        />
      </div>
            {/* Name / Email */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-2 border rounded"
              />
            </div>

            {/* Phone / Password */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                required
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="password"
                placeholder={agent ? "Leave blank to keep current" : "Password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="p-2 border rounded"
                required={!agent}
              />
            </div>

            {/* Bio / Experience */}
                {/* Bio */}
                <div>
                  <textarea
                    placeholder="Bio"
                    value={formData.agentInfo.bio}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 250) { // enforce max 250 characters
                        setFormData({
                          ...formData,
                          agentInfo: { ...formData.agentInfo, bio: value },
                        });
                      }
                    }}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.agentInfo.bio.length}/250 characters
                  </p>
                </div>

            <input
              type="text"
              placeholder="Experience(_ months/years)"
              value={formData.agentInfo.experience}
              onChange={(e) =>
                setFormData({ ...formData, agentInfo: { ...formData.agentInfo, experience: e.target.value } })
              }
              className="w-full p-2 border rounded"
            />

            {/* Specialties */}
            <div>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add specialty"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <Button type="button" onClick={addSpecialty}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.agentInfo.specialties.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center">
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          agentInfo: {
                            ...formData.agentInfo,
                            specialties: formData.agentInfo.specialties.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <Button type="button" onClick={addLanguage}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.agentInfo.languages.map((l, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded flex items-center">
                    {l}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          agentInfo: {
                            ...formData.agentInfo,
                            languages: formData.agentInfo.languages.filter((_, idx) => idx !== i),
                          },
                        })
                      }
                      className="ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


// ---------------- Main Page ----------------
export default function AgentsPage() {
  const { user } = useAuth()
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<User | undefined>()
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents")
        const data: User[] = await res.json()
        data.forEach(a => a.assignedProperties = a.assignedProperties?.map(String) || [])
        setAgents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (!user || user.role !== "super_admin") return <div className="text-center py-12 text-gray-500">Access denied.</div>

  // Edit agent
  const handleEditAgent = (agent: User) => {
    setEditingAgent(agent)
    setShowForm(true)
  }

  // Change agent status
  const handleStatusChange = async (_id: string, status: User["status"]) => {
    try {
      const res = await fetch(`/api/agents/${_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAgents(prev => prev.map(a => a._id === _id ? { ...a, status } : a))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Delete agent
  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return
    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete agent")
      }
      // Remove agent from local state
      setAgents(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      console.error(err)
      alert(`Failed to delete agent: ${err}`)
    }
  }

  // Assign properties
  const handleAssignProperties = (agentId: string, propertyIds: string[]) => {
    setAgents(prev => prev.map(a => a._id === agentId ? { ...a, assignedProperties: propertyIds } : a))
  }

  // Save new/edited agent
  const handleSaveAgent = (updatedAgent: User) => {
    setAgents(prev =>
      prev.some(a => a._id === updatedAgent._id)
        ? prev.map(a => a._id === updatedAgent._id ? updatedAgent : a)
        : [...prev, updatedAgent]
    )
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agents</h1>
        <Button onClick={() => setShowForm(true)}>Add New Agent</Button>
      </div>

      <input type="text" placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded" />

      <div className="grid gap-4 mt-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAgents.map(agent => (
          <AgentCard
            key={agent._id}
            agent={agent}
            onEdit={handleEditAgent}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteAgent}           // ✅ Pass delete handler
            onAssignProperties={handleAssignProperties} // ✅ Pass assign handler
             leadCount={0}
          />
        ))}
      </div>

      {showForm && (
        <AgentForm
          agent={editingAgent}
          onCancel={() => { setShowForm(false); setEditingAgent(undefined) }}
          onSuccess={handleSaveAgent}
        />
      )}
    </div>
  )
}