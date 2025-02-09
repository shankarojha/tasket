"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-gradient text-text">
      {/* Lottie Animation */}
      <iframe src="https://lottie.host/embed/0c8d6eb1-678f-4ba8-9198-9a8d5c3493f7/p58bhI8Cp1.lottie"></iframe>
      
      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Welcome to &#123;Tasket&#125;</h2>

        {error && (
          <p className="text-red-500 text-center bg-red-900/30 p-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text-secondary focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text-secondary focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition flex justify-center"
            disabled={loading}
          >
            {loading ? <span className="animate-pulse">Logging in...</span> : "Login"}
          </button>
        </div>

        <p className="text-secondary text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
