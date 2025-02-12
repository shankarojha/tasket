import type { Metadata } from "next";
import "./globals.css"; // Ensure Tailwind is imported
import Footer from "@/components/footer";

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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className="min-h-screen bg-background-gradient text-text w-full">
        {children}
        <Footer/>
      </body>
      
    </html>
  );
}