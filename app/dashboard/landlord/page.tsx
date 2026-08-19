"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { clearAuthCookies } from "@/utils/cookies";

export default function LandlordDashboard() {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const logout = () => {
    clearAuthCookies();

    useAuthStore
      .getState()
      .clearAuth();

    router.push("/auth/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">
              Landlord Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Welcome, {user?.name ?? "Landlord"}
            </h1>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Stat
            title="Total Properties"
            value="0"
          />

          <Stat
            title="Active Requests"
            value="0"
          />

          <Stat
            title="Total Earnings"
            value="৳0"
          />
        </div>
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}