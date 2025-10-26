"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Loader } from "lucide-react";
import { api } from "@/lib/trpc/react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const signupMutation = api.auth.signup.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      console.log("[SIGNUP] Submitting form:", {
        name: formData.name,
        email: formData.email,
      });

      const result = await signupMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("[SIGNUP] Success! Result:", result);

      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("isLoggedIn", "true");

      setSuccess(true);
      setFormData({ name: "", email: "", password: "" });

      console.log("[SIGNUP] Redirecting to home...");

      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("[SIGNUP] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const fillDemoCredentials = () => {
    setFormData({
      name: "John Doe",
      email: "john@example.com",
      password: "",
    });
  };

  return (
    <>
      <main
        className="min-h-screen flex flex-col"
        style={{
          background: "#F5F5F5",
        }}
      >
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative">
          {/* Left Side - Illustration Area (Full Height Overlay) */}
          <div
            className="hidden lg:flex items-center justify-center p-12 overflow-hidden fixed left-0 top-0 bottom-0 w-1/2 z-0"
            style={{
              background:
                "linear-gradient(135deg, #FFE5D9 0%, #FFD9E8 50%, #F5D9FF 100%)",
              height: "100vh",
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-30"
              style={{
                background: "rgba(255, 107, 107, 0.3)",
              }}
            />
            <div
              className="absolute bottom-20 left-5 w-24 h-24 rounded-full opacity-30"
              style={{
                background: "rgba(107, 114, 255, 0.3)",
              }}
            />

            <div className="relative z-10 text-center">
              <div className="text-8xl mb-6">🚀</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to BlogPlatform
              </h2>
              <p className="text-gray-700 text-lg font-medium">
                Share your stories, inspire the world
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex items-center justify-center px-6 py-6 lg:py-3 lg:mt-10 lg:col-span-2 lg:ml-1/2 relative z-10 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 ">
            <div className="w-full max-w-md">
              {/* Title */}
              {/* Title */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create a free account
                </h1>
              </div>
              {/* Success Message */}
              {success && (
                <div
                  className="mb-6 p-4 rounded-xl border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                  }}
                >
                  <span className="text-2xl">✅</span>
                  <p className="font-medium text-green-700">
                    Account created! Redirecting...
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className="mb-6 p-4 rounded-xl border border-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                  }}
                >
                  <span className="text-2xl">❌</span>
                  <p className="font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Social Buttons */}
              <div className="space-y-3 mb-6 text-sm">
                {/* Google Button */}
                <button
                  type="button"
                  className="w-full py-2 px-4 rounded-full border-2 border-gray-300 hover:border-gray-400 transition flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-normal text-gray-900">
                    Sign up with Google
                  </span>
                </button>

                {/* X/Twitter Button */}
                {/* <button
                  type="button"
                  className="w-full py-2 px-4 rounded-full bg-black hover:bg-gray-800 transition flex items-center justify-center gap-2 text-white"
                >
                  <span>𝕏</span>
                  <span className="font-normal old">Sign in with X</span>
                </button> */}
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className="px-3 text-gray-600 font-medium text-sm"
                    style={{
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    OR
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block ml-4 text-sm font-semibold text-gray-900 mb-1.5"
                  >
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition bg-white placeholder-gray-500 text-black"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block ml-4 text-sm font-semibold text-gray-900 mb-1.5"
                  >
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full text-sm px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition bg-white placeholder-gray-500 text-black"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block ml-4 text-sm font-semibold text-gray-900 mb-1.5"
                  >
                    Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full text-sm px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition bg-white placeholder-gray-500 text-black"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 py-3 px-4 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Signing up...</span>
                    </div>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="text-center text-gray-700 text-sm mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-900 font-bold hover:underline transition"
                >
                  Log in
                </Link>
              </p>

              {/* Terms */}
              <p className="text-center text-gray-500 text-xs mt-6 px-4">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-gray-700 font-semibold hover:underline"
                >
                  terms of use
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
