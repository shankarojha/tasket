'use client'
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show sidebar for any route under /dashboard or /tasks
  const showSidebar = pathname.startsWith("/dashboard") || pathname.startsWith("/tasks");

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className="p-4 sm:ml-64 w-full">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </main>
    </div>
  );
}
