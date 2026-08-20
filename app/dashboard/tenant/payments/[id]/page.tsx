"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Receipt,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getSinglePayment,
} from "@/services/payment.service";

interface Payment {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string | null;
  createdAt: string;
  transactionId?: string | null;
  rentalRequest?: {
    id: string;
    tenant?: {
      id: string;
      name: string;
      email: string;
    };
    property?: {
      id: string;
      title: string;
      address: string;
      city: string;
      rentAmount: number;
    };
  };
}

export default function PaymentDetailsPage() {
  const params = useParams();

  const paymentId = params.id as string;

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const response =
          await getSinglePayment(
            paymentId,
          );

        setPayment(response?.data ?? null);
      } catch (error: any) {
        console.error(
          "Payment details error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load payment.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading payment...
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <Receipt className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-3xl font-black">
            Payment not found
          </h1>

          <Link
            href="/dashboard/tenant/payments"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Back to Payments
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/tenant/payments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-8 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <CreditCard className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-3xl font-black">
              Payment Details
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Transaction information for your rental.
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <Detail
              label="Payment ID"
              value={payment.id}
            />

            <Detail
              label="Amount"
              value={`৳${payment.amount.toLocaleString()}`}
            />

            <Detail
              label="Provider"
              value={payment.provider}
            />

            <Detail
              label="Status"
              value={payment.status}
            />

            <Detail
              label="Payment Date"
              value={new Date(
                payment.paidAt ??
                  payment.createdAt,
              ).toLocaleString()}
            />

            <Detail
              label="Transaction ID"
              value={
                payment.transactionId ??
                "Not available"
              }
            />
          </div>

          {payment.rentalRequest?.property && (
            <div className="border-t p-6 sm:p-8">
              <h2 className="text-xl font-black">
                Rental Property
              </h2>

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <p className="text-lg font-black">
                  {
                    payment.rentalRequest
                      .property.title
                  }
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {
                    payment.rentalRequest
                      .property.address
                  }
                  ,{" "}
                  {
                    payment.rentalRequest
                      .property.city
                  }
                </p>

                <p className="mt-3 font-bold text-blue-600">
                  ৳
                  {payment.rentalRequest.property.rentAmount.toLocaleString()}
                  /month
                </p>
              </div>
            </div>
          )}

          <div className="border-t p-6 sm:p-8">
            <Link
              href="/dashboard/tenant"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-all font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}