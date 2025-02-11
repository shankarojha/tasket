"use client";

import { useLoader } from "@/app/context/loaderContext";

export default function Loader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );
}