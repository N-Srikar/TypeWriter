"use client";

import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Keyboard, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="container mx-auto flex h-20 items-center justify-between px-4">
      {/* Logo */}
      <Link
        href={user ? "/test" : "/"}
        className="flex items-center gap-2 text-xl font-bold text-yellow-500"
      >
        <Keyboard className="h-6 w-6" />
        <span>TypeWriter</span>
      </Link>

      {/* Right Section: User Menu or Login/Signup Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 border-gray-700 bg-[#2c2c2c] text-gray-300"
            >
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#3c3c3c] focus:text-gray-100"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#3c3c3c] focus:text-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
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
                size="sm"
                className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
