"use client";

import { useState, useEffect } from "react";

interface CookieBarProps {
  message: string;
  type: "success" | "error";
}

export default function CookieBar({ message, type }: CookieBarProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm shadow-lg transition-all duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
