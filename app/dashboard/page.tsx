"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { useAuthStore } from "@/store/auth.store";

import {
  getTenantRentalRequests,
} from "@/services/rental-request.service";

import {
  getAllPayments,
} from "@/services/payment.service";

import type {
  TenantRentalRequest,
} from "@/services/rental-request.service";

interface PaymentItem {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string | null;
  createdAt?: string;
  rentalRequest?: {
    property?: {
      title?: string;
    };
  };
}

export default function TenantDashboard() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const [requests, setRequests] = useState<
    TenantRentalRequest[]
  >([]);

  const [payments, setPayments] = useState<
    PaymentItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          requestResponse,
          paymentResponse,
        ] = await Promise.all([
          getTenantRentalRequests(),
          getAllPayments(),
        ]);

        setRequests(
          requestResponse.data ?? [],
        );

        setPayments(
          paymentResponse?.data ?? [],
        );
      } catch (error: any) {
        console.error(
          "Tenant dashboard error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingCount = useMemo(
    () =>
      requests.filter(
        (item) => item.status === "PENDING",
      ).length,
    [requests],
  );

  const approvedCount = useMemo(
    () =>
      requests.filter(
        (item) =>
          item.status === "APPROVED",
      ).length,
    [requests],
  );

  const activeCount = useMemo(
    () =>
      requests.filter(
        (item) => item.status === "ACTIVE",
      ).length,
    [requests],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading dashboard...
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
            Tenant Dashboard
          </p>

          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Welcome, {user?.name ?? "Tenant"} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Manage your rental requests, payments and
                active rentals from one place.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Browse Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Pending Requests"
            value={pendingCount}
            icon={
              <Clock3 className="h-5 w-5 text-orange-600" />
            }
            iconBg="bg-orange-50"
          />

          <StatCard
            title="Approved Requests"
            value={approvedCount}
            icon={
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            }
            iconBg="bg-blue-50"
          />

          <StatCard
            title="Active Rentals"
            value={activeCount}
            icon={
              <Home className="h-5 w-5 text-emerald-600" />
            }
            iconBg="bg-emerald-50"
          />
        </section>

        {/* Request shortcuts */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/tenant/requests"
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Manage
                </p>

                <h2 className="mt-1 text-lg font-black">
                  My Rental Requests
                </h2>
              </div>

              <ArrowRight className="h-5 w-5 text-blue-600" />
            </div>
          </Link>

          <Link
            href="/dashboard/tenant/payments"
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Transactions
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Payment History
                </h2>
              </div>

              <CreditCard className="h-5 w-5 text-violet-600" />
            </div>
          </Link>
        </div>

        {/* Rental Requests */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-black">
                Recent Rental Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your latest property requests.
              </p>
            </div>

            <Link
              href="/dashboard/tenant/requests"
              className="hidden text-sm font-bold text-blue-600 sm:block"
            >
              View all
            </Link>
          </div>

          <div className="divide-y">
            {requests.length === 0 ? (
              <EmptyState />
            ) : (
              requests
                .slice(0, 5)
                .map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                  />
                ))
            )}
          </div>
        </section>

        {/* Payments */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-black">
                Recent Payments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest payment transactions.
              </p>
            </div>

            <Link
              href="/dashboard/tenant/payments"
              className="hidden text-sm font-bold text-blue-600 sm:block"
            >
              View all
            </Link>
          </div>

          <div className="divide-y">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No payment history yet.
              </div>
            ) : (
              payments
                .slice(0, 5)
                .map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                  />
                ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function RequestRow({
  request,
}: {
  request: TenantRentalRequest;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h3 className="truncate font-black text-slate-900">
          {request.property.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-blue-600" />
            {request.property.city}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {new Date(
              request.moveInDate,
            ).toLocaleDateString()}
          </span>

          <span className="font-semibold">
            ৳{request.property.rentAmount.toLocaleString()}
            /month
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RequestStatus status={request.status} />

        {request.status === "APPROVED" && (
          <Link
            href={`/dashboard/tenant/requests/${request.id}/pay`}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Pay Now
          </Link>
        )}
      </div>
    </div>
  );
}

function PaymentRow({
  payment,
}: {
  payment: PaymentItem;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-slate-900">
          {payment.rentalRequest?.property?.title ??
            "Rental Payment"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {payment.provider}
        </p>
      </div>

      <div className="text-left sm:text-right">
        <p className="font-black text-slate-900">
          ৳{payment.amount.toLocaleString()}
        </p>

        <PaymentStatus status={payment.status} />
      </div>
    </div>
  );
}

function RequestStatus({
  status,
}: {
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED";
}) {
  const styles = {
    PENDING:
      "bg-orange-50 text-orange-700",
    APPROVED:
      "bg-blue-50 text-blue-700",
    REJECTED:
      "bg-red-50 text-red-700",
    ACTIVE:
      "bg-emerald-50 text-emerald-700",
    COMPLETED:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}
    >
      {status}
    </span>
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
    FAILED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="p-10 text-center">
      <Home className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-3 font-bold text-slate-700">
        No rental requests yet
      </p>

      <Link
        href="/properties"
        className="mt-3 inline-block text-sm font-bold text-blue-600"
      >
        Browse properties →
      </Link>
    </div>
  );
}