"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";

import { registerUser } from "@/services/auth.service";
import type { RegisterPayload } from "@/types/auth";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: z
    .string()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),

  role: z.enum(["TENANT", "LANDLORD"]),

  phone: z.string().optional(),

  profilePhoto: z
    .string()
    .url("Please provide a valid image URL")
    .optional()
    .or(z.literal("")),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TENANT",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);

      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || undefined,
        profilePhoto: data.profilePhoto || undefined,
      };

      await registerUser(payload);

      toast.success("Account created successfully!");

      router.push("/auth/login");
   } catch (error: unknown) {
  console.error("REGISTER ERROR:", error);

  let message = "Registration failed. Please try again.";

  if (typeof error === "object" && error !== null) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          errors?: Array<{
            path?: string;
            message?: string;
          }>;
        };
      };
      message?: string;
    };

    console.log("STATUS:", axiosError.response?.status);
    console.log("RESPONSE:", axiosError.response?.data);
    console.log("ERROR MESSAGE:", axiosError.message);

    message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      message;
  }

  toast.error(message);
} finally {
  setLoading(false);
}
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* Left */}
          <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <UserPlus className="h-6 w-6" />
                </div>

                <h2 className="mt-8 text-4xl font-black leading-tight">
                  Your next home
                  <span className="block text-blue-200">
                    starts here.
                  </span>
                </h2>

                <p className="mt-5 max-w-sm leading-7 text-blue-100">
                  Join RentNest to discover properties, send
                  rental requests and manage your rental journey.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Create your account in just a few steps.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Get Started
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Choose your role and join RentNest.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              <FormInput
                label="Full Name"
                placeholder="Ibrahim Ahmed"
                error={errors.name?.message}
                {...register("name")}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="g@gmail.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Type
                </label>

                <select
                  id="role"
                  {...register("role")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="TENANT">
                    Tenant
                  </option>

                  <option value="LANDLORD">
                    Landlord
                  </option>
                </select>

                {errors.role?.message && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <FormInput
                label="Phone"
                placeholder="01711111111"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <FormInput
                label="Profile Photo URL"
                placeholder="https://example.com/photo.jpg"
                error={errors.profilePhoto?.message}
                {...register("profilePhoto")}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FormInput({
  label,
  error,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}