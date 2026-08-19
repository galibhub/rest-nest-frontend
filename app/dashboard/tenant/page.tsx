"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { clearAuthCookies } from "@/utils/cookies";
import { logoutUser } from "@/services/auth.service";
import { toast } from "sonner";

export default function TenantDashboard() {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Continue local logout
    } finally {
      clearAuthCookies();

      useAuthStore
        .getState()
        .clearAuth();

      toast.success(
        "Logged out successfully",
      );

      router.push("/auth/login");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">
              Tenant Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Welcome, {user?.name ?? "Tenant"}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard
            title="Pending Requests"
            value="0"
          />

          <StatCard
            title="Approved Requests"
            value="0"
          />

          <StatCard
            title="Active Rentals"
            value="0"
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}