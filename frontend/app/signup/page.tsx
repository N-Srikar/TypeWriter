"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Keyboard } from "lucide-react";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string>("");

  // Handles form submission for user registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const username = (formData.get("username") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Attempt to register the user
      const { token, user } = await register(username, email, password);
      authLogin(token, user);
      router.push("/test"); // Redirect to test page after successful signup
    } catch (err: any) {
      // Handle registration errors
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(err.response.data.message || "User already exists");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-foreground">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-[#2c2c2c] p-8">
        {/* App Logo and Title */}
        <div className="mb-6 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-yellow-500">
            <Keyboard className="h-8 w-8" />
            <span>TypeWriter</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Create an Account</h1>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a username"
                required
                className="border-gray-700 bg-[#232323] focus-visible:ring-yellow-500"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="border-gray-700 bg-[#232323] focus-visible:ring-yellow-500"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                className="border-gray-700 bg-[#232323] focus-visible:ring-yellow-500"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
                className="border-gray-700 bg-[#232323] focus-visible:ring-yellow-500"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-yellow-950 hover:bg-yellow-600"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
