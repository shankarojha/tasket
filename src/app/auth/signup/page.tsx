"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CookieBar from "@/components/cookiebar";
import { toast } from "react-toastify";


type Role = "performer" | "manager"; // Define allowed roles

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<Role>("performer"); // Default role
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) throw new Error("Signup failed. Try again.");

      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-gradient text-text">
      {/* Lottie Animation */}
      <iframe
        src="https://lottie.host/embed/0c8d6eb1-678f-4ba8-9198-9a8d5c3493f7/p58bhI8Cp1.lottie"
        className="w-40 h-40 mb-6"
      ></iframe>

      {/* Glassmorphic Card */}
      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Register to &#123;Tasket&#125;</h2>

        {error && (
          <CookieBar message="Failed to create task." type="error" />
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />

          {/* Role Selection */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4 justify-center">
              <label className="text-secondary font-medium">Select Role:</label>
              {(["performer", "manager"] as Role[]).map((roleOption) => (
                <label key={roleOption} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={role === roleOption}
                    onChange={() => setRole(roleOption)}
                    className="w-4 h-4 text-primary focus:ring-primary-hover cursor-pointer"
                  />
                  <span>{roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition flex justify-center"
            disabled={loading}
          >
            {loading ? <span className="animate-pulse">Signing up...</span> : "Sign Up"}
          </button>
        </div>

        <p className="text-secondary text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
