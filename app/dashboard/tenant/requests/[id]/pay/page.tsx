"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { createCheckoutSession } from "@/services/payment.service";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const rentalRequestId = params.id as string;

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response =
        await createCheckoutSession({
          rentalRequestId,
        });

      const checkoutUrl =
        response.data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error(
          "Checkout URL was not returned.",
        );
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error(
        "Payment error:",
        error,
      );

      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Unable to start payment.";

      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 text-white sm:px-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <CreditCard className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-3xl font-black">
              Complete Payment
            </h1>

            <p className="mt-3 text-blue-100">
              Your rental request has been
              approved. Continue to secure your
              rental through Stripe Checkout.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Rental Request ID
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                {rentalRequestId}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="font-bold text-blue-800">
                    Secure Stripe Checkout
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    You will be redirected to Stripe's
                    secure payment page to complete
                    your payment.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}