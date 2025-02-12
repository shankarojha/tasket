"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CookieBar from "@/components/cookiebar";

type Role = "performer" | "manager"; // Define allowed roles
interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<Role>("performer"); // Default role
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  /**Validations */
  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string): boolean =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateInputs = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!name.trim()) errors.name = "Please enter name";
    if (!isValidEmail(email)) errors.email = "Invalid Email format";
    if (!isValidPassword(password))
      errors.password =
        "Password must be at least 8 characters, including 1 uppercase letter, 1 number, and 1 special character.";
    return errors;
  };
  /**Ends */

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const inputErrors: ValidationErrors = validateInputs();
      if (Object.keys(inputErrors).length > 0) {
        throw new Error(
          inputErrors.email || inputErrors.password || inputErrors.name
        );
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setSuccess(data.message);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.log("err", (err as Error).message);
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
      <iframe
        src="https://lottie.host/embed/0c8d6eb1-678f-4ba8-9198-9a8d5c3493f7/p58bhI8Cp1.lottie"
        className="w-40 h-40 mb-6"
      ></iframe>

      {/* Glassmorphic Card */}
      <div className="bg-card border border-card backdrop-blur-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Register to &#123;Tasket&#125;
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input text-text-secondary focus:outline-none focus:ring-2 focus:ring-input-focus transition"
          />
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

          {/* Role Selection */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4 justify-center">
              <label className="text-secondary font-medium">Select Role:</label>
              {(["performer", "manager"] as Role[]).map((roleOption) => (
                <label
                  key={roleOption}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={role === roleOption}
                    onChange={() => setRole(roleOption)}
                    className="w-4 h-4 text-primary focus:ring-primary-hover cursor-pointer"
                  />
                  <span>
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Signing up...</span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        <p className="text-secondary text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>
      {error && <CookieBar message={error} type="error" />}
      {success && <CookieBar message={success} type="success" />}
    </div>
  );
}
