"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { getAllPayments } from "@/services/payment.service";

interface Payment {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string | null;
  createdAt: string;

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
      rentAmount: number;
    };
  };
}

export default function LandlordPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);

        const response = await getAllPayments({
          page: 1,
          limit: 100,
        });

        setPayments(response?.data ?? []);
      } catch (error: any) {
        console.error(
          "Landlord payments error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load payments.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const completedPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.status === "COMPLETED",
      ),
    [payments],
  );

  const pendingPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.status === "PENDING",
      ),
    [payments],
  );

  const failedPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.status === "FAILED",
      ),
    [payments],
  );

  const totalRevenue = useMemo(
    () =>
      completedPayments.reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0,
      ),
    [completedPayments],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
            Landlord
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Payment Overview
          </h1>

          <p className="mt-2 text-slate-500">
            View payment activity from your rental
            properties.
          </p>
        </div>

        {/* Summary */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Payments"
            value={payments.length}
          />

          <SummaryCard
            title="Completed"
            value={completedPayments.length}
          />

          <SummaryCard
            title="Pending"
            value={pendingPayments.length}
          />

          <SummaryCard
            title="Total Revenue"
            value={`৳${totalRevenue.toLocaleString()}`}
          />
        </section>

        {/* Payments */}
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

              <h2 className="mt-4 text-xl font-black text-slate-900">
                No payments yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Payment activity will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      Tenant
                    </th>

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
                      Payment ID
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-0"
                    >
                      {/* Tenant */}
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          {payment.rentalRequest?.tenant
                            ?.name ?? "Unknown Tenant"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {payment.rentalRequest?.tenant
                            ?.email ?? "—"}
                        </p>
                      </td>

                      {/* Property */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {payment.rentalRequest?.property
                            ?.title ?? "Unknown Property"}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5">
                        <p className="font-black text-blue-600">
                          ৳
                          {Number(
                            payment.amount || 0,
                          ).toLocaleString()}
                        </p>
                      </td>

                      {/* Provider */}
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {payment.provider}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <PaymentStatus
                          status={payment.status}
                        />
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(
                          payment.paidAt ??
                            payment.createdAt,
                        ).toLocaleDateString()}
                      </td>

                      {/* Payment ID */}
                      <td className="px-6 py-5 text-right">
                        <span className="text-xs font-medium text-slate-400">
                          {payment.id.slice(0, 8)}...
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Failed Payment Notice */}
        {failedPayments.length > 0 && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {failedPayments.length} payment
            {failedPayments.length > 1 ? "s" : ""}{" "}
            failed.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
        <CreditCard className="h-5 w-5 text-blue-600" />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PaymentStatus({
  status,
}: {
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED";
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