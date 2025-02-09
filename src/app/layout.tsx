import type { Metadata } from "next";
import "./globals.css"; // Ensure Tailwind is imported

export const metadata: Metadata = {
  title: "Tasket",
  description: "Task Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-gradient text-text">
        {children}
      </body>
    </html>
  );
}