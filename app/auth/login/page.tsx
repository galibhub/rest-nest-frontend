"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Home,
  Loader2,
} from "lucide-react";

import { loginUser } from "@/services/auth.service";
import { setAuthCookies } from "@/utils/cookies";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload } from "@/types/auth";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormValues,
  ) => {
    try {
      setLoading(true);

      const payload: LoginPayload = {
        email: data.email,
        password: data.password,
      };

      const response = await loginUser(payload);

      const { accessToken, user } =
        response.data;

      setAuthCookies(
        accessToken,
        user.role,
      );

      setAuth(user);

      toast.success("Login successful!");

      if (user.role === "TENANT") {
        router.replace("/dashboard/tenant");
      } else if (
        user.role === "LANDLORD"
      ) {
        router.replace(
          "/dashboard/landlord",
        );
      } else if (
        user.role === "ADMIN"
      ) {
        router.replace(
          "/dashboard/admin",
        );
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your email and password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Home className="h-5 w-5" />
                  </span>

                  <span className="text-xl font-black">
                    Rent
                    <span className="text-blue-200">
                      Nest
                    </span>
                  </span>
                </Link>

                <div className="mt-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <LockKeyhole className="h-6 w-6" />
                  </div>

                  <h2 className="mt-7 text-4xl font-black leading-tight">
                    Welcome
                    <span className="block text-blue-200">
                      back home.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-sm leading-7 text-blue-100">
                    Sign in to discover properties,
                    manage rental requests and
                    continue your journey with
                    RentNest.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  One account. Everything you
                  need.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-6 sm:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Welcome Back
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900">
                Login to RentNest
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Enter your account details to
                continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    placeholder="g@gmail.com"
                    {...register("email")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}