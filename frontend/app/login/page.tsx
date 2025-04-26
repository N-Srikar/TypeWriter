"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Keyboard } from "lucide-react";
import { useAuth } from '@/context/authContext';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();

  // Handles form submission for logging in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Attempt to login and save token and user data into context
      const { token, user } = await login(email, password);
      authLogin(token, user);
      router.push('/test'); // Redirect to test page after successful login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[black] text-foreground">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-card p-8">
        {/* App Logo and Title */}
        <div className="mb-6 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-yellow-500">
            <Keyboard className="h-8 w-8" />
            <span>TypeWriter</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Login to your Account</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-yellow-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="border-gray-700 bg-[#232323] focus-visible:ring-yellow-500"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <Button type="submit" className="w-full bg-yellow-500 text-yellow-950 hover:bg-yellow-600">
              Login
            </Button>
          </div>
        </form>

        {/* Link to Signup */}
        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-yellow-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
