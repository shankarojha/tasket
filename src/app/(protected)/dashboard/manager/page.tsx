"use client";
import { getTasksByUser } from "@/lib/actions";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Task } from "@/types/mongodbtypes";

interface User {
  createdAt: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  updatedAt: string | null;
  _id: string | null;
}
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    const storedUser = localStorage.getItem("user");
    const user: User | null = storedUser ? JSON.parse(storedUser) : null;

    if (user?._id) {
      try {
        const tasksResponse = await getTasksByUser(user._id);
        if (tasks) {
          setTasks(tasksResponse.data);
          console.log("tasks", tasksResponse.data)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-left text-gray-300">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((task: Task) => (
                <tr key={task?._id} className="border-t border-gray-700">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3 capitalize text-{task.status === 'completed' ? 'green-400' : 'yellow-400'}">
                    {task.status}
                  </td>
                  <td className="p-3 capitalize">{task.priority}</td>
                  <td className="p-3">
                    {task.assignedTo?.name || "Unassigned"}
                  </td>
                  <td className="p-3">
                    {format(new Date(task.dueDate), "MMM dd, yyyy")}
                  </td>
                </tr>
              ))}
            {!tasks && (
              <tr>
                <td className="p-4 text-center text-gray-400">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
