"use client";
import { getTasksByUser } from "@/lib/actions";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Task } from "@/types/mongodbtypes";
import { User } from "@/types/mongodbtypes";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user: User | null = storedUser ? JSON.parse(storedUser) : null;
      if (user?._id) {
        const tasksResponse = await getTasksByUser(user._id);
        setTasks(tasksResponse?.data || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  const showDetails = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const columns: ColumnsType<Task> = [
    {
      title: <span className="text-xs md:text-sm">Task</span>,
      dataIndex: "title",
      key: "title",
      width: 140,
      render: (title: string) => (
        <span className="text-xs md:text-md">{title.slice(0, 25)}</span>
      ),
      responsive: ["xs", "sm"],
    },
    {
      title: <span className="text-xs md:text-sm">Due Date</span>,
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate: string) => (
        <span className="text-xs md:text-md">
          {format(new Date(dueDate), "MMM dd, yyyy")}
        </span>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: <span className="text-xs md:text-sm">Actions</span>,
      key: "actions",
      render: (_, task) => (
        <Button
          size="small"
          className="text-xs md:text-sm"
          onClick={() => showDetails(task)}
        >
          View Details
        </Button>
      ),
      responsive: ["xs", "sm"],
    },
    {
      title: <span className="text-sm md:text-md">Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "yellow"}>
          <span className="text-xs md:text-sm">{status}</span>
        </Tag>
      ),
      responsive: ["md", "lg"],
    },
    {
      title: <span className="text-sm md:text-md">Priority</span>,
      dataIndex: "priority",
      key: "priority",
      width: 50,
      render: (priority: string) => (
        <Tag
          color={
            priority === "high"
              ? "red"
              : priority === "medium"
              ? "yellow"
              : "blue"
          }
        >
          <span className="text-xs md:text-sm">{priority}</span>
        </Tag>
      ),
      responsive: ["md", "lg"],
    },
    {
      title: <span className="text-sm md:text-md">Assigned To</span>,
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo) => (
        <span className="text-xs md:text-sm">
          {assignedTo?.name || "Unassigned"}
        </span>
      ),
      responsive: ["md", "lg"],
    },
  ];

  return (
    <div className="w-full p-2 mt-10">
      <div className="w-75">
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey={(task) => task._id}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }} //adding scroll for small screen
        />
      </div>

      {/* Modal - task details */}
      <Modal
        title={<span className="text-md md:text-lg">Task Details</span>}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedTask && (
          <div className="text-xs md:text-sm">
            <p>
              <strong>Title:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag
                color={selectedTask.status === "completed" ? "green" : "yellow"}
              >
                {selectedTask.status}
              </Tag>
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <Tag
                color={
                  selectedTask.priority === "high"
                    ? "red"
                    : selectedTask.priority === "medium"
                    ? "yellow"
                    : "blue"
                }
              >
                {selectedTask.priority}
              </Tag>
            </p>
            <p>
              <strong>Assigned To:</strong>{" "}
              {selectedTask.assignedTo?.name || "Unassigned"}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {format(new Date(selectedTask.dueDate), "MMM dd, yyyy")}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedTask.description || "No description provided"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
