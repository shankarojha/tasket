"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "67a995d6f693c4361763ae32", // Default ID for testing
    priority: "high",
    dueDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/protected/tasks/createTask",
        formData,
        { withCredentials: true }
      );
      console.log("Task Created:", response.data);
      router.push("/tasks"); // Redirect to tasks page
    } catch (err) {
      setError((err as Error)?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen backdrop-blur-glass">
      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-100">
        <h2 className="text-2xl font-semibold mb-4 text-text">Create Task</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task Description"
            required
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}