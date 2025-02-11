"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {User} from '@/types/mongodbtypes'
import { createUser, getUsersToAssign } from "@/lib/actions";
import CookieBar from "@/components/cookiebar";

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [success, setSuccess] = useState<string>("");
  const priorityList = ["low", "medium", "high"]

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createUser(formData)
      if (!response.success) throw new Error(response.message);

      setSuccess(response.message);

      setTimeout(() => {
        router.push("/dashboard/manager");
      }, 1500);
    } catch (err) {
      setError((err as Error)?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleGetUsers = async () => {
    try {
      const users = await getUsersToAssign();
      setUsers(users?.data);
    }catch(err){
      console.error(error);
      setError((err as Error).message);
    }finally{
      setTimeout(() => {
        setError("");
      }, 2000);
      setLoading(false);
    }
  }

  useEffect(()=>{
    handleGetUsers();
  },[])

  return (
    <div className="flex justify-center min-h-screen backdrop-blur-glass">
      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-100">
        <h2 className="text-2xl font-semibold mb-4 text-text">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
            className="w-full p-2 border rounded-lg text-text bg-background-gradient"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task Description"
            required
            className="w-full p-2 border rounded-lg text-text bg-background-gradient"
          />
          
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg text-text bg-background-gradient"
          >
            <option value="">Assign To</option>
            {users && users.map((user) => (
              <option key={user._id as string} value={user._id as string}>{user.name}</option>
            ))}
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg text-text bg-background-gradient"
          >
            <option value="">Priority</option>
            {priorityList && priorityList.map((priority) => (
              <option key={priority as string} value={priority as string}>{priority}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg text-text bg-background-gradient"
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
      {error && <CookieBar message={error} type="error" />}
            {success && <CookieBar message={success} type="success" />}
    </div>
  );
}
