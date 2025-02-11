"use client";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show sidebar only for specific routes
  const showSidebar =
    pathname.startsWith("/dashboard") || pathname.startsWith("/tasks");

  return (
      <div className="grid md:grid-cols-12 gap-1 w-full">
        {/* Sidebar (Position Fixed) */}
        {showSidebar && 
        <aside className="md:col-span-3"><Sidebar /></aside>}

        {/* Main Content */}
        <main className=" md:col-span-9 w-full p-2">
            {children}
        </main>
      </div>
  );
}
