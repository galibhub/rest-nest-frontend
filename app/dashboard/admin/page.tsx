"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  Building2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { useAuthStore } from "@/store/auth.store";

import {
  getAllUsers,
  updateUserStatus,
  getAllAdminProperties,
  getAllAdminRentalRequests,
  getAllAdminPayments,
} from "@/services/admin.service";

import type {
  AdminUser,
  AdminProperty,
  AdminRentalRequest,
  UserStatus,
} from "@/types/admin";

interface AdminPayment {
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

export default function AdminDashboard() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const [users, setUsers] = useState<
    AdminUser[]
  >([]);

  const [properties, setProperties] =
    useState<AdminProperty[]>([]);

  const [requests, setRequests] =
    useState<AdminRentalRequest[]>([]);

  const [payments, setPayments] =
    useState<AdminPayment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [userSearch, setUserSearch] =
    useState("");

  const [userStatus, setUserStatus] =
    useState<"" | UserStatus>("");

  const [propertySearch, setPropertySearch] =
    useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const [
          usersResult,
          propertiesResult,
          requestsResult,
          paymentsResult,
        ] = await Promise.all([
          getAllUsers(),
          getAllAdminProperties(),
          getAllAdminRentalRequests(),
          getAllAdminPayments(),
        ]);

        setUsers(usersResult);

        setProperties(
          propertiesResult.data ?? [],
        );

        setRequests(
          requestsResult.data ?? [],
        );

        setPayments(
          paymentsResult?.data ?? [],
        );
      } catch (error: any) {
        console.error(
          "Admin dashboard error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load admin dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  /* =====================================
     USER FILTER
  ===================================== */

  const filteredUsers = useMemo(() => {
    const query =
      userSearch.trim().toLowerCase();

    return users.filter((item) => {
      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.email
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        !userStatus ||
        item.status === userStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    users,
    userSearch,
    userStatus,
  ]);

  /* =====================================
     PROPERTY FILTER
  ===================================== */

  const filteredProperties = useMemo(() => {
    const query =
      propertySearch
        .trim()
        .toLowerCase();

    return properties.filter(
      (item) =>
        !query ||
        item.title
          .toLowerCase()
          .includes(query) ||
        item.city
          .toLowerCase()
          .includes(query) ||
        item.address
          .toLowerCase()
          .includes(query),
    );
  }, [
    properties,
    propertySearch,
  ]);

  /* =====================================
     STATS
  ===================================== */

  const blockedUsers = users.filter(
    (item) =>
      item.status === "BLOCKED",
  ).length;

  const availableProperties =
    properties.filter(
      (item) =>
        item.availability ===
        "AVAILABLE",
    ).length;

  const pendingRequests =
    requests.filter(
      (item) =>
        item.status === "PENDING",
    ).length;

  const completedPayments =
    payments.filter(
      (item) =>
        item.status === "COMPLETED",
    );

  const pendingPayments =
    payments.filter(
      (item) =>
        item.status === "PENDING",
    );

  const totalRevenue =
    completedPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0,
    );

  /* =====================================
     USER STATUS
  ===================================== */

  const handleStatusChange = async (
    targetUser: AdminUser,
  ) => {
    if (
      targetUser.id === user?.id ||
      targetUser.role === "ADMIN"
    ) {
      toast.error(
        "Admin accounts cannot be changed.",
      );

      return;
    }

    const nextStatus: UserStatus =
      targetUser.status === "ACTIVE"
        ? "BLOCKED"
        : "ACTIVE";

    try {
      setActionId(targetUser.id);

      const updated =
        await updateUserStatus(
          targetUser.id,
          nextStatus,
        );

      setUsers((current) =>
        current.map((item) =>
          item.id === targetUser.id
            ? updated
            : item,
        ),
      );

      toast.success(
        nextStatus === "BLOCKED"
          ? "User blocked successfully."
          : "User unblocked successfully.",
      );
    } catch (error: any) {
      console.error(
        "User status error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to update user status.",
      );
    } finally {
      setActionId(null);
    }
  };

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading admin dashboard...
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
        {/* =====================================
            HEADER
        ===================================== */}

        <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Administration
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Welcome,{" "}
                {user?.name ?? "Admin"} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Manage users, properties, rental
                requests and platform payments.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Administrator
            </div>
          </div>
        </section>

        {/* =====================================
            STATS
        ===================================== */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            title="Users"
            value={users.length}
            icon={
              <Users className="h-5 w-5 text-blue-600" />
            }
            bg="bg-blue-50"
          />

          <StatCard
            title="Blocked"
            value={blockedUsers}
            icon={
              <Ban className="h-5 w-5 text-red-600" />
            }
            bg="bg-red-50"
          />

          <StatCard
            title="Properties"
            value={properties.length}
            icon={
              <Building2 className="h-5 w-5 text-violet-600" />
            }
            bg="bg-violet-50"
          />

          <StatCard
            title="Available"
            value={availableProperties}
            icon={
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            }
            bg="bg-emerald-50"
          />

          <StatCard
            title="Pending Requests"
            value={pendingRequests}
            icon={
              <ClipboardList className="h-5 w-5 text-orange-600" />
            }
            bg="bg-orange-50"
          />

          <StatCard
            title="Revenue"
            value={`৳${totalRevenue.toLocaleString()}`}
            icon={
              <CreditCard className="h-5 w-5 text-blue-600" />
            }
            bg="bg-blue-50"
          />
        </section>

        {/* =====================================
            USER MANAGEMENT
        ===================================== */}

        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-black">
              User Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search users and activate or block accounts.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={userSearch}
                  onChange={(event) =>
                    setUserSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search name or email..."
                  className="w-full rounded-xl border px-4 py-3 pl-10 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <select
                value={userStatus}
                onChange={(event) =>
                  setUserStatus(
                    event.target
                      .value as
                      | ""
                      | UserStatus,
                  )
                }
                className="rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">
                  All Status
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="BLOCKED">
                  Blocked
                </option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredUsers.length ===
            0 ? (
              <div className="p-10 text-center text-slate-500">
                No users found.
              </div>
            ) : (
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (item) => {
                      const isAdmin =
                        item.role ===
                        "ADMIN";

                      const isLoading =
                        actionId ===
                        item.id;

                      return (
                        <tr
                          key={item.id}
                          className="border-b last:border-0 hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <UserRound className="h-5 w-5 text-blue-600" />
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {item.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                              {item.role}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                item.status
                              }
                            />
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-500">
                            {new Date(
                              item.createdAt,
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              disabled={
                                isAdmin ||
                                isLoading
                              }
                              onClick={() =>
                                handleStatusChange(
                                  item,
                                )
                              }
                              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                isAdmin
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : item.status ===
                                      "ACTIVE"
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : item.status ===
                                "ACTIVE" ? (
                                "Block"
                              ) : (
                                "Unblock"
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* =====================================
            PROPERTY MODERATION
        ===================================== */}

        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Property Moderation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor all platform properties.
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-2">
                <span className="text-sm font-bold text-emerald-700">
                  {availableProperties}{" "}
                  available
                </span>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={propertySearch}
                onChange={(event) =>
                  setPropertySearch(
                    event.target.value,
                  )
                }
                placeholder="Search property or location..."
                className="w-full rounded-xl border px-4 py-3 pl-10 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.length ===
            0 ? (
              <div className="col-span-full p-8 text-center text-slate-500">
                No properties found.
              </div>
            ) : (
              filteredProperties.map(
                (property) => (
                  <div
                    key={property.id}
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {property.title}
                        </h3>

                        <p className="mt-2 flex items-start gap-1 text-sm text-slate-500">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                          <span>
                            {
                              property.address
                            }
                            ,{" "}
                            {
                              property.city
                            }
                          </span>
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {property.category
                          ?.name ??
                          "Property"}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black text-blue-600">
                          ৳
                          {Number(
                            property.rentAmount ||
                              0,
                          ).toLocaleString()}
                        </p>

                        <p className="text-xs text-slate-400">
                          / month
                        </p>
                      </div>

                      <AvailabilityBadge
                        status={
                          property.availability
                        }
                      />
                    </div>

                    <div className="mt-5 border-t pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Landlord
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {
                          property
                            .landlord
                            ?.name
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          property
                            .landlord
                            ?.email
                        }
                      </p>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </section>

        {/* =====================================
            RENTAL REQUEST MODERATION
        ===================================== */}

        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-black">
              Rental Request Moderation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review rental activity across the platform.
            </p>
          </div>

          <div className="overflow-x-auto">
            {requests.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No rental requests found.
              </div>
            ) : (
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      Tenant
                    </th>

                    <th className="px-6 py-4">
                      Property
                    </th>

                    <th className="px-6 py-4">
                      Move In
                    </th>

                    <th className="px-6 py-4">
                      Request
                    </th>

                    <th className="px-6 py-4">
                      Payment
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map(
                    (request) => (
                      <tr
                        key={request.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">
                            {
                              request
                                .tenant
                                .name
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              request
                                .tenant
                                .email
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">
                            {
                              request
                                .property
                                .title
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              request
                                .property
                                .city
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {new Date(
                            request.moveInDate,
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-5">
                          <RequestStatusBadge
                            status={
                              request.status
                            }
                          />
                        </td>

                        <td className="px-6 py-5">
                          {request.payment ? (
                            <div>
                              <p className="font-bold text-slate-900">
                                ৳
                                {Number(
                                  request
                                    .payment
                                    .amount ||
                                    0,
                                ).toLocaleString()}
                              </p>

                              <PaymentStatusBadge
                                status={
                                  request
                                    .payment
                                    .status
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No payment
                            </span>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* =====================================
            PAYMENTS
        ===================================== */}

        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Payment Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor platform payment activity.
              </p>
            </div>

            <div className="flex gap-3 text-sm">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
                {completedPayments.length} completed
              </span>

              <span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-700">
                {pendingPayments.length} pending
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No payments found.
              </div>
            ) : (
              <table className="w-full min-w-[1000px]">
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
                  </tr>
                </thead>

                <tbody>
                  {payments.map(
                    (payment) => (
                      <tr
                        key={payment.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">
                            {
                              payment
                                .rentalRequest
                                ?.tenant
                                ?.name ??
                              "Unknown Tenant"
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              payment
                                .rentalRequest
                                ?.tenant
                                ?.email ??
                              "—"
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5 font-semibold text-slate-900">
                          {
                            payment
                              .rentalRequest
                              ?.property
                              ?.title ??
                            "Unknown Property"
                          }
                        </td>

                        <td className="px-6 py-5 font-black text-blue-600">
                          ৳
                          {Number(
                            payment.amount ||
                              0,
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {payment.provider}
                        </td>

                        <td className="px-6 py-5">
                          <PaymentStatusBadge
                            status={
                              payment.status
                            }
                          />
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {new Date(
                            payment.paidAt ??
                              payment.createdAt,
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
      >
        {icon}
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

/* =========================================
   USER STATUS
========================================= */

function StatusBadge({
  status,
}: {
  status: UserStatus;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        status === "ACTIVE"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================
   PROPERTY AVAILABILITY
========================================= */

function AvailabilityBadge({
  status,
}: {
  status:
    | "AVAILABLE"
    | "RENTED"
    | "UNAVAILABLE";
}) {
  const styles = {
    AVAILABLE:
      "bg-emerald-50 text-emerald-700",
    RENTED:
      "bg-red-50 text-red-700",
    UNAVAILABLE:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   RENTAL REQUEST STATUS
========================================= */

function RequestStatusBadge({
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

/* =========================================
   PAYMENT STATUS
========================================= */

function PaymentStatusBadge({
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
      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}
    >
      {status}
    </span>
  );
}