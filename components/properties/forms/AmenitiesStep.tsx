"use client"

import { useEffect, useState } from "react"
import { Amenity, Property } from "@/lib/types"
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"

interface AmenitiesStepProps {
    formData: Property
    update: (data: Partial<Property>) => void
}

export default function AmenitiesStep({ formData, update }: AmenitiesStepProps) {
    const [amenities, setAmenities] = useState<Amenity[]>([])
    const [loading, setLoading] = useState(true)

    // Add/Edit form fields
    const [newAmenity, setNewAmenity] = useState({
        title: "",
        image: "",
        category: "building",
    })

    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null)

    const categories = [
        "building",
        "recreational",
        "indoor",
        "outdoor",
        "safety",
        "convenience",
        "connectivity",
        "farming",
        "others",
    ] as const

    /* ----------------------------------------------------
      FIX #1 → Normalize amenities from formData on mount
    ---------------------------------------------------- */
    useEffect(() => {
        if (formData.amenities?.length) {
            const normalized = formData.amenities.map((a: any) =>
                typeof a === "string" ? a : a._id
            )
            update({ amenities: normalized })
        }
    }, [])

    /* ----------------------------------------------------
      Load amenities list
    ---------------------------------------------------- */
    useEffect(() => {
        loadAmenities()
    }, [])

    const loadAmenities = async () => {
        try {
            const res = await fetch("/api/amenities")
            const data = await res.json()

            if (data.success) {
                setAmenities(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch amenities:", error)
        } finally {
            setLoading(false)
        }
    }

    /* ----------------------------------------------------
      Selected Amenity Set (IDs only)
    ---------------------------------------------------- */
    const selected = new Set(
        (formData.amenities ?? []).map((a: any) =>
            typeof a === "string" ? a : a?._id
        )
    )

    const toggleAmenitySelection = (id: string) => {
        const updated = selected.has(id)
            ? formData.amenities.filter((x) => (typeof x === "string" ? x : x._id) !== id)
            : [...formData.amenities, id]

        update({ amenities: updated })
    }

    /* ----------------------------------------------------
      Add New Amenity
    ---------------------------------------------------- */
    const handleCreateAmenity = async () => {
        if (!newAmenity.title.trim()) return alert("Amenity title is required")

        try {
            const res = await fetch("/api/amenities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAmenity),
            })

            const data = await res.json()
            if (data.success) {
                await loadAmenities()
                setNewAmenity({ title: "", image: "", category: "building" })
                alert("Amenity added!")
            }
        } catch {
            alert("Failed to add amenity")
        }
    }

    /* ----------------------------------------------------
      Update Amenity
    ---------------------------------------------------- */
    const handleUpdateAmenity = async () => {
        if (!editingAmenity) return

        try {
            const res = await fetch(`/api/amenities/${editingAmenity._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingAmenity),
            })

            const data = await res.json()
            if (data.success) {
                setEditingAmenity(null)
                await loadAmenities()
                alert("Amenity updated!")
            }
        } catch {
            alert("Failed to update amenity")
        }
    }

    /* ----------------------------------------------------
      Activate / Deactivate
    ---------------------------------------------------- */
    const toggleActive = async (id: string) => {
        try {
            const target = amenities.find(a => a._id === id)
            const res = await fetch(`/api/amenities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !target?.isActive }),
            })

            const data = await res.json()
            if (data.success) loadAmenities()
        } catch {
            alert("Failed to update status")
        }
    }

    /* ----------------------------------------------------
      UI
    ---------------------------------------------------- */
    return (
        <div className="space-y-8">

            {/* ADD / EDIT FORM */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg mb-3">
                    {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium">Amenity Title</label>
                        <input
                            type="text"
                            value={editingAmenity ? editingAmenity.title : newAmenity.title}
                            onChange={(e) =>
                                editingAmenity
                                    ? setEditingAmenity({ ...editingAmenity, title: e.target.value })
                                    : setNewAmenity({ ...newAmenity, title: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={editingAmenity ? editingAmenity.category : newAmenity.category}
                            onChange={(e) =>
                                editingAmenity
                                    ? setEditingAmenity({ ...editingAmenity, category: e.target.value })
                                    : setNewAmenity({ ...newAmenity, category: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c.replace("-", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-medium">Image/Icon</label>
                        <FileUpload
                            value={editingAmenity ? editingAmenity.image : newAmenity.image}
                            onChange={(url) =>
                                editingAmenity
                                    ? setEditingAmenity({ ...editingAmenity, image: url })
                                    : setNewAmenity({ ...newAmenity, image: url })
                            }
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Buttons */}
                {editingAmenity ? (
                    <div className="mt-4 flex gap-3">
                        <Button onClick={handleUpdateAmenity} className="bg-blue-600 text-white">
                            Update Amenity
                        </Button>
                        <Button variant="outline" onClick={() => setEditingAmenity(null)}>
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleCreateAmenity} className="mt-4 bg-green-600 text-white">
                        Add Amenity
                    </Button>
                )}
            </div>

            {/* ----------------------------------------------------
                SELECT AMENITIES FOR PROPERTY
            ---------------------------------------------------- */}
            <h3 className="text-lg font-semibold">Select Amenities for Property</h3>

            {loading && <p>Loading amenities...</p>}

            {!loading &&
                categories.map((category) => {
                    const filtered = amenities.filter((a) => a.category === category)
                    if (filtered.length === 0) return null

                    return (
                        <div key={category} className="mb-6">
                            <h4 className="font-medium text-gray-800 mb-2 capitalize">
                                {category.replace("-", " ")}
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {filtered.map((a) => (
                                    <div
                                        key={a._id}
                                        className={`relative border p-3 rounded-lg flex flex-col gap-2 group transition ${
                                            a.isActive ? "hover:bg-gray-50" : "opacity-50"
                                        }`}
                                    >
                                        {/* Action buttons */}
                                        <div className="absolute top-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                            {/* Edit */}
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => setEditingAmenity(a)}
                                            >
                                                ✏️
                                            </button>

                                            {/* Activate / Deactivate */}
                                            <button
                                                className={a.isActive ? "text-green-600" : "text-red-600"}
                                                onClick={() => toggleActive(a._id)}
                                            >
                                                ⚡
                                            </button>
                                        </div>

                                        {a.image && (
                                            <img
                                                src={a.image}
                                                className="h-12 w-12 object-contain mx-auto"
                                            />
                                        )}

                                        <label className="flex items-center gap-2 mt-3">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(a._id)}
                                                disabled={!a.isActive}
                                                onChange={() => toggleAmenitySelection(a._id)}
                                            />
                                            <span className="text-sm">{a.title}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}
