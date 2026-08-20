"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getAllPayments,
} from "@/services/payment.service";

interface Payment {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string | null;
  createdAt: string;
  rentalRequest?: {
    id?: string;
    property?: {
      id?: string;
      title?: string;
      rentAmount?: number;
    };
  };
}

export default function TenantPaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response =
          await getAllPayments();

        setPayments(response?.data ?? []);
      } catch (error: any) {
        console.error(
          "Payment history error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load payment history.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
            Tenant
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Payment History
          </h1>

          <p className="mt-2 text-slate-500">
            View all payments associated with your rentals.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading payments...
              </div>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-xl font-black">
                No payments yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Completed or pending payments will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      Property
                    </th>

                    <th className="px-6 py-4">
                      Amount
                    </th>

                    <th className="px-6 py-4">
                      Provider
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                            <CreditCard className="h-5 w-5 text-violet-600" />
                          </div>

                          <p className="font-bold">
                            {payment.rentalRequest
                              ?.property
                              ?.title ??
                              "Rental Payment"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-black">
                        ৳{payment.amount.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {payment.provider}
                      </td>

                      <td className="px-6 py-5">
                        <PaymentStatus
                          status={payment.status}
                        />
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          payment.paidAt ??
                            payment.createdAt,
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/dashboard/tenant/payments/${payment.id}`}
                          className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-slate-50"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PaymentStatus({
  status,
}: {
  status: "PENDING" | "COMPLETED" | "FAILED";
}) {
  const styles = {
    PENDING:
      "bg-orange-50 text-orange-700",
    COMPLETED:
      "bg-emerald-50 text-emerald-700",
    FAILED:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}
    >
      {status}
    </span>
  );
}