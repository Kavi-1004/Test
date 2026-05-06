"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Pencil, Trash2, Search, Shield, ShieldCheck } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", roleId: "", isActive: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/users", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setRoles(data.roles || []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [refreshKey]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() {
    setForm({ name: "", email: "", password: "", roleId: "", isActive: true });
    setEditing(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(u: User) {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      roleId: u.role.id,
      isActive: u.isActive,
    });
    setEditing(u);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/users/${editing.id}` : "/api/users";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      resetForm();
      setRefreshKey((k) => k + 1);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Failed to save user");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRefreshKey((k) => k + 1);
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Failed to delete user");
    }
  }

  async function toggleActive(u: User) {
    await fetch(`/api/users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...u, roleId: u.role.id, isActive: !u.isActive }),
    });
    setRefreshKey((k) => k + 1);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and roles</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit User" : "Add User"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editing ? "(leave blank to keep current)" : "*"}
              </label>
              <input type="password" value={form.password}
                required={!editing}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select required value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                {editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-600">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Add your first user to get started</p>
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                      <Plus className="w-4 h-4" /> Add User
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        u.role.name === "admin" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {u.role.name === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {u.role.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(u)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(u)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
