"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Send,
  Home,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { useAuthStore } from "@/store/auth.store";

import { createRentalRequest } from "@/services/rental-request.service";

export default function RentalRequestPage() {
  const params = useParams();
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const propertyId = params.id as string;

  const [moveInDate, setMoveInDate] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!user) {
      toast.error(
        "Please login before submitting a rental request.",
      );

      router.push(
        `/auth/login?redirect=/properties/${propertyId}/request`,
      );

      return;
    }

    if (user.role !== "TENANT") {
      toast.error(
        "Only tenants can submit rental requests.",
      );

      return;
    }

    if (!moveInDate) {
      toast.error(
        "Please select your move-in date.",
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await createRentalRequest({
          propertyId,
          moveInDate,
          message:
            message.trim() || undefined,
        });

      toast.success(
        response.message ||
          "Rental request submitted successfully.",
      );

      router.push(
        "/dashboard/tenant",
      );
    } catch (error: any) {
      console.error(
        "Rental request error:",
        error,
      );

      const message =
        error?.response?.data?.message ??
        "Failed to submit rental request.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={`/properties/${propertyId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Property
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 text-white sm:px-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Home className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              Request to Rent
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Submit your rental request to the
              landlord. The request will remain
              pending until the landlord reviews it.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
          >
            {/* Property ID */}
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Property ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                {propertyId}
              </p>
            </div>

            {/* Move in date */}
            <div>
              <label
                htmlFor="moveInDate"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Move-in Date
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="moveInDate"
                  type="date"
                  min={today}
                  value={moveInDate}
                  onChange={(e) =>
                    setMoveInDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Message
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="message"
                rows={6}
                maxLength={500}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Tell the landlord anything important about your rental request..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {message.length}/500
              </p>
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-700">
              Your request will be submitted with
              <strong> PENDING </strong>
              status. The landlord must approve it
              before you can continue to payment.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Rental Request
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}