"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../components/ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const router = useRouter();

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_URL}/`, { credentials: "include" });
      if (res.status === 401) return router.push("/login");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (res.status === 401) return router.push("/login");
      setUsername("");
      setPassword("");
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }

  function confirmDelete(id) {
    setUserToDelete(id);
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    try {
      await fetch(`${API_URL}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userToDelete }),
        credentials: "include",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  }

  function handleDeleteCancel() {
    setConfirmOpen(false);
    setUserToDelete(null);
  }

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/logout`, { credentials: "include" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Home Page</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Users List
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {u.id}: {u.username}
                  </span>
                  <button
                    onClick={() => confirmDelete(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add User</h2>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded shadow transition"
            >
              Add User
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}
