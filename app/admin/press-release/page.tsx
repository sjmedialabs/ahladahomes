"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";
import { X } from "lucide-react";

// ------------------------------------------------------
// PRESS TYPE
// ------------------------------------------------------
interface PressRelease {
  _id?: string;
  title: string;
  image: string;
  date: string;
  description?: string;
}

export default function PressReleaseAdminPage() {
  const [pressList, setPressList] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PressRelease | null>(null);

  const [form, setForm] = useState<PressRelease>({
    title: "",
    image: "",
    date: "",
    description: "",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ------------------------------------------------------
  // FETCH PRESS RELEASES
  // ------------------------------------------------------
  const loadPressReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/press-releases");
      const data = await res.json();

      if (data.success) {
        setPressList(data.data);
      }
    } catch (error) {
      console.error("Failed to load press releases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPressReleases();
  }, []);

  // ------------------------------------------------------
  // OPEN ADD / EDIT MODAL
  // ------------------------------------------------------
  const openAddModal = () => {
    setEditItem(null);
    setForm({ title: "", image: "", date: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (item: PressRelease) => {
    setEditItem(item);
    setForm(item);
    setModalOpen(true);
  };

  // ------------------------------------------------------
  // HANDLE SAVE (ADD OR UPDATE)
  // ------------------------------------------------------
  const handleSave = async () => {
    try {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `/api/press-releases/${editItem._id}`
        : "/api/press-releases";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadPressReleases();
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  // ------------------------------------------------------
  // HANDLE DELETE
  // ------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/press-releases/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setDeleteId(null);
        loadPressReleases();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Press Release Management</h2>

      {/* Add Button */}
      <button
        onClick={openAddModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-6"
      >
        + Add Press Release
      </button>

      {/* Loading State */}
      {loading ? (
        <p>Loading...</p>
      ) : pressList.length === 0 ? (
        <p>No press releases found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pressList.map((item) => (
                <tr key={item._id}>
                  <td className="border p-3">
                    <img
                      src={item.image}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="border p-3">{item.title}</td>
                  <td className="border p-3">{item.date}</td>

                  <td className="border p-3 flex gap-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(item._id!)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------
          ADD / EDIT MODAL
      ------------------------------------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute right-4 top-4 text-gray-600"
              onClick={() => setModalOpen(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Press Release" : "Add Press Release"}
            </h3>

            {/* Title */}
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Date */}
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Description */}
            <label className="block mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              rows={3}
            />

            {/* Image */}
            <label className="block mb-2">Image</label>
            <FileUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              accept="image/*"
            />

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="mt-5 w-full py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------
          DELETE CONFIRM MODAL
      ------------------------------------------------------ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this press release?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
