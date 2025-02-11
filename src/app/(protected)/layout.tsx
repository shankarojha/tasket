"use client";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { LoaderProvider } from "@/app/context/loaderContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sideBarRoutes: string[] = ["/dashboard", "/tasks", "/profile"]; //routes that has sidebar

// Show sidebar only for specific routes
const showSidebar = sideBarRoutes.some(route => pathname.startsWith(route));

  return (
      <div className="grid md:grid-cols-12 gap-1 w-full">
        {showSidebar && 
        <aside className="md:col-span-3 xl:col-span-2"><Sidebar /></aside>}

        {/* Main Content */}
        <main className=" md:col-span-9  xl:col-span-10 w-full p-2 content-center">
          <LoaderProvider>
            {children}
          </LoaderProvider>
        </main>
      </div>
  );
}
