"use client";

import Link from "next/link";
import {
  Home,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { clearAuthCookies } from "@/utils/cookies";
import { logoutUser } from "@/services/auth.service";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthCookies();
      clearAuth();

      toast.success("Logged out successfully");

      setIsOpen(false);

      router.push("/");
      router.refresh();
    }
  };

  const dashboardPath =
    user?.role === "TENANT"
      ? "/dashboard/tenant"
      : user?.role === "LANDLORD"
        ? "/dashboard/landlord"
        : user?.role === "ADMIN"
          ? "/dashboard/admin"
          : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Home className="h-5 w-5" strokeWidth={2.5} />
          </div>

          <span className="text-xl font-black tracking-tight text-slate-900">
            Rent<span className="text-blue-600">Nest</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            Properties
          </Link>

          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                <UserRound className="h-4 w-4" />
                Login
              </Link>

              <Link
                href="/auth/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Dashboard */}
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* User */}
              <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold text-slate-900">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/properties"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Properties
            </Link>

            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <div className="border-t border-slate-100 pt-3">
                  <p className="px-4 text-sm font-bold text-slate-900">
                    {user.name}
                  </p>

                  <p className="px-4 text-xs text-slate-500">
                    {user.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}