"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  CalendarDays,
  MapPin,
  UserRound,
  Home,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getLandlordRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  LandlordRentalRequest,
} from "@/services/rental-request.service";

export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<
    LandlordRentalRequest[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [actionId, setActionId] =
    useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response =
        await getLandlordRentalRequests();

      setRequests(response.data ?? []);
    } catch (error) {
      console.error(
        "Landlord requests error:",
        error,
      );

      toast.error(
        "Failed to load rental requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (
    requestId: string,
  ) => {
    try {
      setActionId(requestId);

      await approveRentalRequest(requestId);

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "APPROVED",
                property: {
                  ...request.property,
                  availability: "RENTED",
                },
              }
            : request,
        ),
      );

      toast.success(
        "Rental request approved successfully.",
      );
    } catch (error: any) {
      console.error(
        "Approve request error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to approve request.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (
    requestId: string,
  ) => {
    try {
      setActionId(requestId);

      await rejectRentalRequest(requestId);

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "REJECTED",
              }
            : request,
        ),
      );

      toast.success(
        "Rental request rejected successfully.",
      );
    } catch (error: any) {
      console.error(
        "Reject request error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to reject request.",
      );
    } finally {
      setActionId(null);
    }
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Landlord
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Rental Requests
            </h1>

            <p className="mt-2 text-slate-500">
              Review incoming rental requests and
              approve or reject them.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 px-5 py-3">
            <p className="text-xs font-semibold text-orange-600">
              Pending requests
            </p>

            <p className="mt-1 text-2xl font-black text-orange-700">
              {pendingRequests.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-white">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading rental requests...
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
              <Home className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-xl font-black">
                No rental requests
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You currently don't have any incoming
                rental requests.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {requests.map((request) => {
                const isActionLoading =
                  actionId === request.id;

                return (
                  <div
                    key={request.id}
                    className="rounded-3xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Request info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-black text-slate-900">
                            {request.property.title}
                          </h2>

                          <StatusBadge
                            status={request.status}
                          />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <Info
                            icon={
                              <UserRound className="h-4 w-4 text-blue-600" />
                            }
                            label="Tenant"
                            value={
                              request.tenant.name
                            }
                          />

                          <Info
                            icon={
                              <MapPin className="h-4 w-4 text-blue-600" />
                            }
                            label="Location"
                            value={`${request.property.city}`}
                          />

                          <Info
                            icon={
                              <CalendarDays className="h-4 w-4 text-emerald-600" />
                            }
                            label="Move-in Date"
                            value={new Date(
                              request.moveInDate,
                            ).toLocaleDateString()}
                          />

                          <Info
                            icon={
                              <Home className="h-4 w-4 text-violet-600" />
                            }
                            label="Monthly Rent"
                            value={`৳${request.property.rentAmount.toLocaleString()}`}
                          />
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Tenant Email
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {request.tenant.email}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {request.status ===
                        "PENDING" && (
                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            disabled={
                              isActionLoading
                            }
                            onClick={() =>
                              handleApprove(
                                request.id,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isActionLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}

                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={
                              isActionLoading
                            }
                            onClick={() =>
                              handleReject(
                                request.id,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}

                      {request.status ===
                        "APPROVED" && (
                        <div className="rounded-xl bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700">
                          Approved
                        </div>
                      )}

                      {request.status ===
                        "REJECTED" && (
                        <div className="rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-700">
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
}) {
  const styles = {
    PENDING:
      "bg-orange-50 text-orange-700",
    APPROVED:
      "bg-blue-50 text-blue-700",
    REJECTED:
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