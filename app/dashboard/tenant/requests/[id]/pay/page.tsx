"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Home,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getTenantRentalRequests,
} from "@/services/rental-request.service";

import type {
  TenantRentalRequest,
} from "@/services/rental-request.service";

export default function TenantRequestsPage() {
  const [requests, setRequests] = useState<
    TenantRentalRequest[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response =
          await getTenantRentalRequests();

        setRequests(response.data ?? []);
      } catch (error: any) {
        console.error(
          "Tenant requests error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load rental requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
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
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
            Tenant
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            My Rental Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Track every rental request you have submitted.
          </p>
        </div>

        <section className="mt-8">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-white">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading requests...
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
              <Home className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-xl font-black">
                No rental requests
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You haven't submitted any rental requests yet.
              </p>

              <Link
                href="/properties"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function RequestCard({
  request,
}: {
  request: TenantRentalRequest;
}) {
  return (
    <article className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-black text-slate-900">
              {request.property.title}
            </h2>

            <StatusBadge
              status={request.status}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Info
              icon={
                <MapPin className="h-4 w-4 text-blue-600" />
              }
              label="Location"
              value={request.property.city}
            />

            <Info
              icon={
                <CalendarDays className="h-4 w-4 text-emerald-600" />
              }
              label="Move-in"
              value={new Date(
                request.moveInDate,
              ).toLocaleDateString()}
            />

            <Info
              icon={
                <CreditCard className="h-4 w-4 text-violet-600" />
              }
              label="Monthly Rent"
              value={`৳${request.property.rentAmount.toLocaleString()}`}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {request.status === "APPROVED" && (
            <Link
              href={`/dashboard/tenant/requests/${request.id}/pay`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Link>
          )}

          {request.status === "ACTIVE" && (
            <div className="rounded-xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700">
              Rental Active
            </div>
          )}

          <Link
            href={`/properties/${request.property.id}`}
            className="rounded-xl border px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            View Property
          </Link>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({
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

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        {icon}

        <span className="text-xs font-semibold text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}