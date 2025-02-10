"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary hover:bg-primary-hover text-white"
      >
        {isOpen ? <X size={20} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-background text-text-secondary p-5 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="mt-6">
          <h1 className="p-3 text-lg">&#123;Tasket&#125;</h1>
          {/* Navigation Links */}
          <ul className="space-y-4 mt-6">
            <li>
              <button
                onClick={() => router.push("/dashboard")}
                className="p-3 rounded-lg hover:bg-text-secondary hover:text-text w-full text-left"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/tasks")}
                className="p-3 rounded-lg hover:bg-text-secondary hover:text-text w-full text-left"
              >
                Tasks
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/profile")}
                className="p-3 rounded-lg hover:bg-text-secondary hover:text-text w-full text-left"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/logout")}
                className="p-3 rounded-lg hover:bg-text-secondary hover:text-text w-full text-left"
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
