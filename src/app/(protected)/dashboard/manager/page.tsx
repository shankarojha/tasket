"use client";
import { getTasksByUser } from "@/lib/actions";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Form, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Task } from "@/types/mongodbtypes";
import { User } from "@/types/mongodbtypes";
import { getUsersToAssign } from "@/lib/actions";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    handleGetUsers()
    if (selectedTask) {
      console.log(selectedTask)
      form.setFieldsValue({
        taskId:selectedTask._id,
        title: selectedTask.title,
        status: selectedTask.status,
        priority: selectedTask.priority,
        assignedTo: selectedTask.assignedTo?._id,
        description: selectedTask.description,
        comments: selectedTask.comments || "",
      });
    }
  }, [selectedTask, form]);

  const handleGetUsers = async () => {
      try {
        const users = await getUsersToAssign();
        setUsers(users?.data);
      } catch (err) {
        console.error(error);
        setError((err as Error).message);
      } finally {
        setTimeout(() => {
          setError("");
        }, 2000);
        setLoading(false);
      }
    };

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

  const handleUpdateTask = (value: Task) => {
    console.log(value);
    form.resetFields();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
    setShowInput(false);
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
          scroll={{ x: "max-content" }}
        />
      </div>

      {!showInput && (
        <Modal
          title={<span className="text-md md:text-lg">Task Details</span>}
          open={modalVisible}
          onCancel={handleModalClose}
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
                  color={
                    selectedTask.status === "assigned"
                      ? "yellow"
                      : selectedTask.status === "in-progress"
                      ? "blue"
                      : selectedTask.status === "cancelled"
                      ? "red"
                      : "green"
                  }
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
              <button
                className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowInput(true)}
              >
                Edit
              </button>
            </div>
          )}
        </Modal>
      )}

      {showInput && (
        <Modal
          title={<span className="text-md md:text-lg">Edit Task</span>}
          open={modalVisible}
          footer={null}
          onCancel={handleModalClose}
        >
          {selectedTask && (
            <Form form={form} layout="vertical" onFinish={handleUpdateTask}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={2} placeholder="Enter Title" />
              </Form.Item>

              <Form.Item label="Status" name="status">
                <Select>
                  <Select.Option value="assigned">Assigned</Select.Option>
                  <Select.Option value="in-progress">In Progress</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Assign to" name="assignedTo">
                <Select>
                  {users && users.map((user)=>(
                    <Select.Option key={user._id} value={user._id}>{user.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Priority" name="priority">
                <Select>
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} placeholder="Enter task description" />
              </Form.Item>

              <Form.Item label="Comments" name="comments">
                <Input.TextArea rows={3} placeholder="Comments" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Task
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
}
