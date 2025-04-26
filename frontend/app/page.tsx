'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.replace('/test');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <main className="flex min-h-screen flex-col bg-black text-gray-300">
      {/* Navbar */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Keyboard className="h-6 w-6 text-yellow-500" />
          <span className="text-xl font-bold text-yellow-500">TypeWriter</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" passHref>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <Keyboard className="h-16 w-16 text-yellow-500 md:h-20 md:w-20" />
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-yellow-500 md:text-5xl">
          TypeWriter
        </h1>
        <p className="mb-8 max-w-md text-lg text-gray-300">
          Test and improve your typing speed
        </p>
      </div>
    </main>
  );
}
