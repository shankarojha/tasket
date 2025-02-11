"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Style from "@/styles/sidebar.module.css";
import { User } from "@/types/mongodbtypes";
import axios from "axios";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState("");

  const fectRole = async () => {
    const storedUser = localStorage.getItem("user");
    const user: User | null = storedUser ? JSON.parse(storedUser) : null;
    if (user?.role) {
      setRole(user?.role);
    }
  };

  useEffect(() => {
    fectRole();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });

      

      // clean and redirect to login page
      localStorage.clear();
      window.location.href = "auth/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1 left-4 z-50 p-2 rounded-lg bg-text-secondary hover:bg-primary-hover text-text sm:hidden `}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 md:w-100 lg:w-64 h-screen bg-background text-text-secondary p-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } sm:translate-x-0`}
      >
        <div className="mt-6">
          <h1 className="p-3 text-lg">&#123;Tasket&#125;</h1>

          {/*Links */}
          <ul className="space-y-4 mt-6">
            {[
              { name: "Assigned Tasks", path: "/dashboard/performer" },
              { name: "Managed Tasks", path: "/dashboard/manager" },
              { name: "Create Task", path: "/tasks/createTask" },
              { name: "Profile", path: "/profile" },
            ].map(({ name, path }) => (
              <li key={path}>
                <button
                  onClick={() => router.push(path)}
                  className="p-3 rounded-lg hover:bg-text-secondary hover:text-text w-full text-left"
                >
                  {name}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={logout} 
                className="p-3 rounded-lg hover:bg-red-600 hover:text-white w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
