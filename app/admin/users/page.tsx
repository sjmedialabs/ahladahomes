"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "tenant" | "property_owner" | "maintenance_staff" | "admin"
  status: "Active" | "Inactive" | "Suspended"
  joinDate: string
  lastLogin: string
  propertiesViewed: number
  inquiriesMade: number
  propertiesOwned?: number
  maintenanceRequests?: number
  avatar?: string
}

const UserCard = ({
  user,
  onEdit,
  onStatusChange,
  onDelete,
  canEdit,
}: {
  user: User
  onEdit: (user: User) => void
  onStatusChange: (id: number, status: User["status"]) => void
  onDelete: (id: number) => void
  canEdit: boolean
}) => {
  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "property_owner":
        return "bg-blue-100 text-blue-800"
      case "maintenance_staff":
        return "bg-orange-100 text-orange-800"
      case "tenant":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplay = (role: User["role"]) => {
    switch (role) {
      case "property_owner":
        return "Property Owner"
      case "maintenance_staff":
        return "Maintenance Staff"
      case "admin":
        return "Administrator"
      case "tenant":
        return "Tenant"
      default:
        return role
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-500 text-sm">{user.phone}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {getRoleDisplay(user.role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Joined</p>
            <p className="font-medium">{user.joinDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Login</p>
            <p className="font-medium">{user.lastLogin}</p>
          </div>
          {user.role === "property_owner" && (
            <>
              <div>
                <p className="text-gray-500">Properties Owned</p>
                <p className="font-medium">{user.propertiesOwned || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Inquiries Received</p>
                <p className="font-medium">{user.inquiriesMade}</p>
              </div>
            </>
          )}
          {user.role === "maintenance_staff" && (
            <>
              <div>
                <p className="text-gray-500">Requests Handled</p>
                <p className="font-medium">{user.maintenanceRequests || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Properties Serviced</p>
                <p className="font-medium">{user.propertiesViewed}</p>
              </div>
            </>
          )}
          {user.role === "tenant" && (
            <>
              <div>
                <p className="text-gray-500">Properties Viewed</p>
                <p className="font-medium">{user.propertiesViewed}</p>
              </div>
              <div>
                <p className="text-gray-500">Inquiries Made</p>
                <p className="font-medium">{user.inquiriesMade}</p>
              </div>
            </>
          )}
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => onEdit(user)} className="flex-1">
              Edit
            </Button>
            <select
              value={user.status}
              onChange={(e) => onStatusChange(user.id, e.target.value as User["status"])}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <Button size="sm" variant="destructive" onClick={() => onDelete(user.id)}>
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const UserForm = ({
  user,
  onSave,
  onCancel,
}: {
  user?: User
  onSave: (
    user: Omit<
      User,
      "id" | "joinDate" | "lastLogin" | "propertiesViewed" | "inquiriesMade" | "propertiesOwned" | "maintenanceRequests"
    >,
  ) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || ("tenant" as const),
    status: user?.status || ("Active" as const),
    avatar: user?.avatar || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{user ? "Edit User" : "Add New User"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                className="w-full p-2 border rounded"
              >
                <option value="tenant">Tenant</option>
                <option value="property_owner">Property Owner</option>
                <option value="maintenance_staff">Maintenance Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as User["status"] })}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Avatar URL (Optional)</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1">
                {user ? "Update User" : "Add User"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const UserStats = ({ users }: { users: User[] }) => {
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "Active").length
  const propertyOwners = users.filter((u) => u.role === "property_owner").length
  const tenants = users.filter((u) => u.role === "tenant").length
  const maintenanceStaff = users.filter((u) => u.role === "maintenance_staff").length
  const admins = users.filter((u) => u.role === "admin").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{propertyOwners}</div>
          <div className="text-sm text-gray-600">Property Owners</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{tenants}</div>
          <div className="text-sm text-gray-600">Tenants</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{maintenanceStaff}</div>
          <div className="text-sm text-gray-600">Maintenance</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{admins}</div>
          <div className="text-sm text-gray-600">Admins</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      role: "tenant",
      status: "Active",
      joinDate: "2025-01-10",
      lastLogin: "2025-01-20",
      propertiesViewed: 15,
      inquiriesMade: 3,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+91 98765 43211",
      role: "property_owner",
      status: "Active",
      joinDate: "2025-01-05",
      lastLogin: "2025-01-21",
      propertiesViewed: 45,
      inquiriesMade: 12,
      propertiesOwned: 5,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+91 98765 43212",
      role: "maintenance_staff",
      status: "Active",
      joinDate: "2025-01-15",
      lastLogin: "2025-01-18",
      propertiesViewed: 25,
      inquiriesMade: 0,
      maintenanceRequests: 18,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+91 98765 43213",
      role: "admin",
      status: "Active",
      joinDate: "2024-12-01",
      lastLogin: "2025-01-21",
      propertiesViewed: 120,
      inquiriesMade: 0,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")

  const canEditUsers = currentUser?.role === "super_admin"

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "All" || user.role === filterRole
    const matchesStatus = filterStatus === "All" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = () => {
    setEditingUser(undefined)
    setShowForm(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleSaveUser = (
    userData: Omit<
      User,
      "id" | "joinDate" | "lastLogin" | "propertiesViewed" | "inquiriesMade" | "propertiesOwned" | "maintenanceRequests"
    >,
  ) => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...userData,
                id: editingUser.id,
                joinDate: editingUser.joinDate,
                lastLogin: editingUser.lastLogin,
                propertiesViewed: editingUser.propertiesViewed,
                inquiriesMade: editingUser.inquiriesMade,
                propertiesOwned: editingUser.propertiesOwned,
                maintenanceRequests: editingUser.maintenanceRequests,
              }
            : u,
        ),
      )
    } else {
      const newUser: User = {
        ...userData,
        id: Math.max(...users.map((u) => u.id)) + 1,
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        propertiesViewed: 0,
        inquiriesMade: 0,
        propertiesOwned: userData.role === "property_owner" ? 0 : undefined,
        maintenanceRequests: userData.role === "maintenance_staff" ? 0 : undefined,
      }
      setUsers([...users, newUser])
    }
    setShowForm(false)
  }

  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const handleStatusChange = (id: number, status: User["status"]) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users and their permissions</p>
        </div>
        {canEditUsers && (
          <Button onClick={handleAddUser} className="bg-red-500 hover:bg-red-600">
            Add New User
          </Button>
        )}
      </div>

      <UserStats users={users} />

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="p-2 border rounded">
          <option value="All">All Roles</option>
          <option value="tenant">Tenant</option>
          <option value="property_owner">Property Owner</option>
          <option value="maintenance_staff">Maintenance Staff</option>
          <option value="admin">Administrator</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteUser}
            canEdit={canEditUsers}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
        </div>
      )}

      {showForm && canEditUsers && (
        <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setShowForm(false)} />
      )}
    </div>
  )
}
