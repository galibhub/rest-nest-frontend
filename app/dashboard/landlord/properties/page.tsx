"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { useAuthStore } from "@/store/auth.store";

import {
  getAllProperties,
  deleteProperty,
} from "@/services/property.service";

import type { Property } from "@/types/property";

export default function MyPropertiesPage() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const [properties, setProperties] = useState<
    Property[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const loadProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const response =
        await getAllProperties({
          page: 1,
          limit: 100,
        });

      const allProperties =
        response.data?.data ?? [];

      const ownProperties =
        allProperties.filter(
          (property) =>
            property.landlordId === user.id ||
            property.landlord?.id === user.id,
        );

      setProperties(ownProperties);
    } catch (error: any) {
      console.error(
        "Load properties error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to load properties.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  const filteredProperties = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return properties;
    }

    return properties.filter((property) =>
      [
        property.title,
        property.address,
        property.city,
      ].some((field) =>
        field
          .toLowerCase()
          .includes(value),
      ),
    );
  }, [properties, search]);

  const handleDelete = async (
    property: Property,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(property.id);

      await deleteProperty(property.id);

      setProperties((current) =>
        current.filter(
          (item) =>
            item.id !== property.id,
        ),
      );

      toast.success(
        "Property deleted successfully.",
      );
    } catch (error: any) {
      console.error(
        "Delete property error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete property.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
              Landlord
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              My Properties
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your rental listings.
            </p>
          </div>

          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>

        <div className="relative mt-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by title, city or address..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <section className="mt-6">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-white">
              <div className="flex items-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading properties...
              </div>
            </div>
          ) : filteredProperties.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-xl font-black text-slate-900">
                No properties found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {properties.length === 0
                  ? "You haven't added any properties yet."
                  : "Try changing your search."}
              </p>

              {properties.length ===
                0 && (
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map(
                (property) => (
                  <article
                    key={property.id}
                    className="overflow-hidden rounded-3xl border bg-white shadow-sm"
                  >
                    <div className="relative h-52 bg-slate-100">
                      {property.images?.[0] ? (
                        <img
                          src={
                            property.images[0]
                          }
                          alt={
                            property.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Building2 className="h-12 w-12 text-slate-300" />
                        </div>
                      )}

                      <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-700 shadow">
                        {property.availability}
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="truncate text-lg font-black text-slate-900">
                        {property.title}
                      </h2>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {property.address},{" "}
                        {property.city}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <Info
                          label="Rent"
                          value={`৳${Number(
                            property.rentAmount,
                          ).toLocaleString()}`}
                        />

                        <Info
                          label="Beds"
                          value={String(
                            property.bedrooms,
                          )}
                        />

                        <Info
                          label="Baths"
                          value={String(
                            property.bathrooms,
                          )}
                        />
                      </div>

                      <div className="mt-5 flex gap-2">
                        <Link
                          href={`/dashboard/landlord/properties/${property.id}/edit`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            property.id
                          }
                          onClick={() =>
                            handleDelete(
                              property,
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          property.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}