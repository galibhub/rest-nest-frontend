"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { useAuthStore } from "@/store/auth.store";

import { getAllProperties } from "@/services/property.service";
import { getLandlordRentalRequests } from "@/services/rental-request.service";
import { getAllPayments } from "@/services/payment.service";

export default function LandlordDashboard() {
  const user = useAuthStore((state) => state.user);

  const [properties, setProperties] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const [
          propertyResponse,
          requestResponse,
          paymentResponse,
        ] = await Promise.all([
          getAllProperties({
            limit: 100,
          }),
          getLandlordRentalRequests(),
          getAllPayments({
            limit: 100,
          }),
        ]);

        const allProperties =
          propertyResponse?.data?.data ?? [];

        const myProperties = allProperties.filter(
          (property: any) =>
            property.landlord?.id === user.id ||
            property.landlordId === user.id,
        );

        setProperties(myProperties);

        setRequests(
          requestResponse?.data ?? [],
        );

        setPayments(
          paymentResponse?.data ?? [],
        );
      } catch (error: any) {
        console.error(
          "Landlord dashboard error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load landlord dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.id]);

  const availableCount = useMemo(
    () =>
      properties.filter(
        (item) =>
          item.availability === "AVAILABLE",
      ).length,
    [properties],
  );

  const rentedCount = useMemo(
    () =>
      properties.filter(
        (item) =>
          item.availability === "RENTED",
      ).length,
    [properties],
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (item) =>
          item.status === "PENDING",
      ).length,
    [requests],
  );

  const completedPayments = useMemo(
    () =>
      payments.filter(
        (item) =>
          item.status === "COMPLETED",
      ),
    [payments],
  );

  const totalRevenue = completedPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading landlord dashboard...
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
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
                Landlord Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Welcome, {user?.name ?? "Landlord"} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
                Manage your properties, rental requests and
                payment activity from one place.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/properties/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="My Properties"
            value={properties.length}
            icon={
              <Building2 className="h-5 w-5 text-blue-600" />
            }
            bg="bg-blue-50"
          />

          <StatCard
            title="Available"
            value={availableCount}
            icon={
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            }
            bg="bg-emerald-50"
          />

          <StatCard
            title="Rented"
            value={rentedCount}
            icon={
              <Home className="h-5 w-5 text-violet-600" />
            }
            bg="bg-violet-50"
          />

          <StatCard
            title="Pending Requests"
            value={pendingRequests}
            icon={
              <Clock3 className="h-5 w-5 text-orange-600" />
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

        {/* Quick Actions */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardLink
            href="/dashboard/landlord/properties"
            title="My Properties"
            subtitle="Create, edit and delete listings"
            icon={
              <Building2 className="h-5 w-5 text-blue-600" />
            }
          />

          <DashboardLink
            href="/dashboard/landlord/requests"
            title="Rental Requests"
            subtitle="Approve or reject tenant requests"
            icon={
              <Users className="h-5 w-5 text-orange-600" />
            }
          />

          <DashboardLink
            href="/dashboard/landlord/payments"
            title="Payment Overview"
            subtitle="View rental payment activity"
            icon={
              <CreditCard className="h-5 w-5 text-violet-600" />
            }
          />
        </section>

        {/* My Properties */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-black">
                My Properties
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest property listings.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/properties"
              className="text-sm font-bold text-blue-600"
            >
              View all
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-black">
                No properties yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first property listing.
              </p>

              <Link
                href="/dashboard/landlord/properties/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
              {properties
                .slice(0, 6)
                .map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
            </div>
          )}
        </section>

        {/* Recent Requests */}
        <section className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-black">
                Recent Rental Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest requests from tenants.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/requests"
              className="text-sm font-bold text-blue-600"
            >
              View all
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No rental requests yet.
            </div>
          ) : (
            <div className="divide-y">
              {requests
                .slice(0, 5)
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {request.property?.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.tenant?.name} •{" "}
                        {request.property?.city}
                      </p>
                    </div>

                    <RequestStatus
                      status={request.status}
                    />
                  </div>
                ))}
            </div>
          )}
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

function DashboardLink({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            {icon}
          </div>

          <h3 className="mt-4 font-black">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
      </div>
    </Link>
  );
}

function PropertyCard({
  property,
}: {
  property: any;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-900">
            {property.title}
          </h3>

          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {property.city}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">
          {property.availability}
        </span>
      </div>

      <p className="mt-5 text-xl font-black text-blue-600">
        ৳{Number(property.rentAmount).toLocaleString()}
      </p>

      <p className="text-xs text-slate-400">
        / month
      </p>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/dashboard/landlord/properties/${property.id}/edit`}
          className="flex-1 rounded-xl border px-3 py-2 text-center text-sm font-bold hover:bg-slate-50"
        >
          Edit
        </Link>

        <Link
          href={`/properties/${property.id}`}
          className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white hover:bg-blue-600"
        >
          View
        </Link>
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