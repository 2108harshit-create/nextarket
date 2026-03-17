"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

export default function Home() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace(currentUser.role === "buyer" ? "/buyer" : "/seller");
    } else {
      router.replace("/auth/login");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading Venturova...</p>
      </div>
    </div>
  );
}
