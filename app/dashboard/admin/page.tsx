"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Building2,
  ClipboardList,
  ShieldCheck,
  Search,
  Ban,
  CheckCircle2,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getAllUsers,
  updateUserStatus,
  getAllAdminProperties,
  getAllAdminRentalRequests,
} from "@/services/admin.service";

import { useAuthStore } from "@/store/auth.store";

import type {
  AdminUser,
  AdminProperty,
  AdminRentalRequest,
  UserStatus,
} from "@/types/admin";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [properties, setProperties] = useState<
    AdminProperty[]
  >([]);
  const [requests, setRequests] = useState<
    AdminRentalRequest[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] =
    useState<string | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] =
    useState<"" | UserStatus>("");

  const [propertySearch, setPropertySearch] =
    useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [
        usersResult,
        propertiesResult,
        requestsResult,
      ] = await Promise.all([
        getAllUsers(),
        getAllAdminProperties(),
        getAllAdminRentalRequests(),
      ]);

      setUsers(usersResult);
      setProperties(propertiesResult.data);
      setRequests(requestsResult.data);
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error,
      );

      toast.error(
        "Failed to load admin dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch =
        !userSearch ||
        item.name
          .toLowerCase()
          .includes(userSearch.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(userSearch.toLowerCase());

      const matchesStatus =
        !userStatus ||
        item.status === userStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, userSearch, userStatus]);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      return (
        !propertySearch ||
        item.title
          .toLowerCase()
          .includes(
            propertySearch.toLowerCase(),
          ) ||
        item.city
          .toLowerCase()
          .includes(
            propertySearch.toLowerCase(),
          ) ||
        item.address
          .toLowerCase()
          .includes(
            propertySearch.toLowerCase(),
          )
      );
    });
  }, [properties, propertySearch]);

  const blockedUsers = users.filter(
    (item) => item.status === "BLOCKED",
  ).length;

  const pendingRequests = requests.filter(
    (item) => item.status === "PENDING",
  ).length;

  const availableProperties =
    properties.filter(
      (item) =>
        item.availability === "AVAILABLE",
    ).length;

  const handleStatusChange = async (
    targetUser: AdminUser,
  ) => {
    if (
      targetUser.id === user?.id ||
      targetUser.role === "ADMIN"
    ) {
      toast.error(
        "Admin accounts cannot be changed from this table.",
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
        `User ${nextStatus === "BLOCKED" ? "blocked" : "unblocked"} successfully.`,
      );
    } catch (error: any) {
      console.error(
        "Update user status error:",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading admin dashboard...
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Welcome, {user?.name ?? "Admin"} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Monitor users, properties and rental
                requests from one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Administrator
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={
              <Users className="h-5 w-5 text-blue-600" />
            }
            bg="bg-blue-50"
          />

          <StatCard
            title="Blocked Users"
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
            title="Pending Requests"
            value={pendingRequests}
            icon={
              <ClipboardList className="h-5 w-5 text-orange-600" />
            }
            bg="bg-orange-50"
          />
        </div>

        {/* Users */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <div>
              <h2 className="text-xl font-black">
                User Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search users and change their active or
                blocked status.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={userSearch}
                  onChange={(e) =>
                    setUserSearch(e.target.value)
                  }
                  placeholder="Search by name or email..."
                  className="w-full rounded-xl border px-4 py-3 pl-10 outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={userStatus}
                onChange={(e) =>
                  setUserStatus(
                    e.target.value as
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
            {filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No users found.
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
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
                        item.role === "ADMIN";

                      const isLoading =
                        actionId === item.id;

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
                              status={item.status}
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

        {/* Properties */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Property Moderation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor all listed properties and
                  their availability.
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-2">
                <span className="text-sm font-bold text-emerald-700">
                  {availableProperties} available
                </span>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={propertySearch}
                onChange={(e) =>
                  setPropertySearch(
                    e.target.value,
                  )
                }
                placeholder="Search property or location..."
                className="w-full rounded-xl border px-4 py-3 pl-10 outline-none focus:border-blue-500"
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

                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {property.address},{" "}
                          {property.city}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {property.category
                          .name}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black text-blue-600">
                          ৳
                          {property.rentAmount.toLocaleString()}
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
                        {property.landlord.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {property.landlord.email}
                      </p>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </section>

        {/* Rental Requests */}
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
                          <p className="font-bold">
                            {request.tenant.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              request.tenant
                                .email
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold">
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
                              <p className="font-bold">
                                ৳
                                {request.payment.amount.toLocaleString()}
                              </p>

                              <p className="text-xs text-slate-500">
                                {
                                  request
                                    .payment
                                    .status
                                }
                              </p>
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
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
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
    RENTED: "bg-red-50 text-red-700",
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