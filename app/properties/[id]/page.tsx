"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  Home,
  UserRound,
  Phone,
  Mail,
  CheckCircle2,
  CalendarDays,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { getSingleProperty } from "@/services/property.service";

import type { Property } from "@/types/property";

import { useAuthStore } from "@/store/auth.store";

import PropertyReviews from "@/components/property/PropertyReviews";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const [property, setProperty] =
    useState<Property | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeImage, setActiveImage] =
    useState(0);

  useEffect(() => {
    const propertyId = params.id as string;

    if (!propertyId) {
      return;
    }

    const loadProperty = async () => {
      try {
        setLoading(true);

        const response =
          await getSingleProperty(propertyId);

        setProperty(
          response?.data ?? null,
        );
      } catch (error) {
        console.error(
          "Property details error:",
          error,
        );

        toast.error(
          "Failed to load property details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [params.id]);

  /* =========================================
     Loading
  ========================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading property...
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =========================================
     Property not found
  ========================================= */

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <Home className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-3xl font-black text-slate-900">
            Property not found
          </h1>

          <p className="mt-3 text-slate-500">
            This property may have been removed or is no
            longer available.
          </p>

          <Link
            href="/properties"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  /* =========================================
     Property data
  ========================================= */

  const images =
    property.images?.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=1400&auto=format&fit=crop",
        ];

  const currentImage =
    images[activeImage] ?? images[0];

  const isAvailable =
    property.availability === "AVAILABLE";

  const handleRequestToRent = () => {
    if (!user) {
      toast.info(
        "Please login as a tenant to request this property.",
      );

      router.push(
        `/auth/login?redirect=/properties/${property.id}`,
      );

      return;
    }

    if (user.role !== "TENANT") {
      toast.error(
        "Only tenants can request a property.",
      );

      return;
    }

    if (!isAvailable) {
      toast.error(
        "This property is currently not available.",
      );

      return;
    }

    router.push(
      `/properties/${property.id}/request`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* =====================================
            Breadcrumb
        ===================================== */}

        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>

        {/* =====================================
            Main
        ===================================== */}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* =====================================
              Gallery
          ===================================== */}

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative h-[360px] overflow-hidden rounded-3xl bg-slate-200 sm:h-[500px]">
              <Image
                src={currentImage}
                alt={property.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />

              <div className="absolute left-5 top-5">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : property.availability ===
                          "RENTED"
                        ? "bg-red-50 text-red-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {property.availability}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {images
                .slice(0, 3)
                .map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImage(index)
                    }
                    className={`relative min-h-[110px] overflow-hidden rounded-2xl border-2 transition lg:min-h-0 ${
                      activeImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${property.title} ${
                        index + 1
                      }`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* =====================================
              Content
          ===================================== */}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* =====================================
                Left
            ===================================== */}

            <div>
              {/* Property Details */}
              <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {property.category?.name && (
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        {property.category.name}
                      </span>
                    )}

                    <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                      {property.title}
                    </h1>

                    <div className="mt-3 flex items-start gap-2 text-slate-500">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                      <span>
                        {property.address},{" "}
                        {property.city}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <p className="text-3xl font-black text-blue-600">
                      ৳
                      {Number(
                        property.rentAmount,
                      ).toLocaleString()}
                    </p>

                    <p className="text-right text-sm text-slate-400">
                      per month
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <InfoCard
                    icon={
                      <BedDouble className="h-5 w-5 text-blue-600" />
                    }
                    label="Bedrooms"
                    value={String(
                      property.bedrooms,
                    )}
                  />

                  <InfoCard
                    icon={
                      <Bath className="h-5 w-5 text-emerald-600" />
                    }
                    label="Bathrooms"
                    value={String(
                      property.bathrooms,
                    )}
                  />

                  <InfoCard
                    icon={
                      <Home className="h-5 w-5 text-violet-600" />
                    }
                    label="Type"
                    value={
                      property.category?.name ??
                      "Property"
                    }
                  />

                  <InfoCard
                    icon={
                      <CheckCircle2 className="h-5 w-5 text-orange-600" />
                    }
                    label="Status"
                    value={
                      property.availability
                    }
                  />
                </div>

                {/* Description */}
                <div className="mt-10">
                  <h2 className="text-xl font-black text-slate-900">
                    About this property
                  </h2>

                  <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="mt-10">
                  <h2 className="text-xl font-black text-slate-900">
                    Amenities
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {property.amenities?.map(
                      (amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          {amenity}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* =====================================
                  Landlord
              ===================================== */}

              <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-black text-slate-900">
                  About the landlord
                </h2>

                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                    <UserRound className="h-7 w-7 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {property.landlord?.name ??
                        "Property Landlord"}
                    </h3>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500">
                      {property.landlord
                        ?.email && (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {
                            property.landlord
                              .email
                          }
                        </span>
                      )}

                      {property.landlord
                        ?.phone && (
                        <span className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {
                            property.landlord
                              .phone
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* =====================================
                  Reviews
              ===================================== */}

              <PropertyReviews
                propertyId={property.id}
              />
            </div>

            {/* =====================================
                Request Card
            ===================================== */}

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-3xl border bg-white p-6 shadow-lg">
                <p className="text-sm font-bold text-slate-500">
                  Monthly Rent
                </p>

                <p className="mt-1 text-4xl font-black text-blue-600">
                  ৳
                  {Number(
                    property.rentAmount,
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  per month
                </p>

                <div className="my-6 border-t" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Availability
                    </span>

                    <span
                      className={`font-bold ${
                        isAvailable
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {property.availability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Bedrooms
                    </span>

                    <span className="font-semibold">
                      {property.bedrooms}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Bathrooms
                    </span>

                    <span className="font-semibold">
                      {property.bathrooms}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={
                    handleRequestToRent
                  }
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  <CalendarDays className="h-4 w-4" />

                  {isAvailable
                    ? "Request to Rent"
                    : "Currently Unavailable"}

                  {isAvailable && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>

                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <p className="text-xs leading-5 text-blue-700">
                    Rental requests are reviewed by
                    the landlord before payment is
                    available.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* =========================================
   Info Card
========================================= */

function InfoCard({
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
      {icon}

      <p className="mt-3 text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}