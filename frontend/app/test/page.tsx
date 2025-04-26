"use client";

import TypingTest from "@/components/typing-test";
import Header from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

// Typing Test Page
export default function TestPage() {
  const { user } = useAuth(); // Get the authenticated user
  const router = useRouter(); // Initialize the router

  // Redirect to home page if user is not logged in
  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  // While authentication status is loading, don't render anything
  if (!user) {
    return null;
  }

  // Render the typing test page once user is authenticated
  return (
    <main className="flex min-h-screen flex-col bg-black text-gray-300">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <TypingTest />
      </div>
    </main>
  );
}
