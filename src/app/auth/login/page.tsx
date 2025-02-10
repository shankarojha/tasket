"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CookieBar from "@/components/cookiebar";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.post("/auth/login", {email,password
      });

      console.log(res)
      setLoading(false);

      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => {
          router.push(`/dashboard/${res?.data?.data?.user?.role}`);
        }, 1000);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setTimeout(() => {
        setError("");
      }, 2000);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-gradient text-text">
      {/* Lottie Animation */}
      <iframe src="https://lottie.host/embed/0c8d6eb1-678f-4ba8-9198-9a8d5c3493f7/p58bhI8Cp1.lottie"></iframe>

      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Welcome to &#123;Tasket&#125;
        </h2>

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
            {loading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <p className="text-secondary text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
      {error && <CookieBar message={error} type="error" />}
      {success && <CookieBar message={success} type="success" />}
    </div>
  );
}
