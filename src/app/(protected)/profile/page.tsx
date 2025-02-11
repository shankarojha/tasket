"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updatePassword } from "@/lib/actions";
import { User } from "@/types/mongodbtypes";
import CookieBar from "@/components/cookiebar";
import Loader from "@/components/loader";
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await updatePassword(formData);
      if (!response.success) throw new Error(response.message);

      setSuccess(response.message);
      setShowPasswordInput(false);
    } catch (err) {
        setSuccess("")
      setError((err as Error)?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user: User | null = storedUser ? JSON.parse(storedUser) : null;
        if (user?._id) {
          const response = await getProfile(user?._id);
          setUser(response.data);
        }
      } catch (err) {
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">User Profile</h2>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || "N/A"}
        </p>
        <p>
          <strong>User ID:</strong> {user?._id || "N/A"}
        </p>
        <p>
          <strong>Created At:</strong> {user?.createdAt || "N/A"}
        </p>
        <p>
          <strong>Updated At:</strong> {user?.updatedAt || "N/A"}
        </p>
      </div>
      {!showPasswordInput && (
        <button
          className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowPasswordInput(true)}
        >
          Change Password
        </button>
      )}
      {showPasswordInput && (
        <div>
          <input
            type="password"
            placeholder="Old Password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-text bg-background-gradient mt-2"
          />
          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-text bg-background-gradient mt-2"
          />
          <button
            className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      )}
      {error && <CookieBar message={error} type="error" />}
      {success && <CookieBar message={success} type="success" />}
    </div>
  );
}
