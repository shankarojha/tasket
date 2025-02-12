import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/auth/login"); // Redirect to login page
  return null; // This will never render because of the redirect
}