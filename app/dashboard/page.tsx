"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    switch (user.role) {
      case "TENANT":
        router.replace("/dashboard/tenant");
        break;

      case "LANDLORD":
        router.replace("/dashboard/landlord");
        break;

      case "ADMIN":
        router.replace("/dashboard/admin");
        break;

      default:
        router.replace("/");
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

        <p className="mt-4 text-sm text-slate-500">
          Opening dashboard...
        </p>
      </div>
    </main>
  );
}