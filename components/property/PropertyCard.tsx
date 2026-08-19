import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  ArrowRight,
  CheckCircle2,
  Home,
} from "lucide-react";

import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const image =
    property.images?.[0] ??
    "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=1200&auto=format&fit=crop";

  const availabilityStyles = {
    AVAILABLE:
      "bg-emerald-50 text-emerald-700",
    RENTED: "bg-red-50 text-red-700",
    UNAVAILABLE:
      "bg-slate-100 text-slate-600",
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Availability */}
        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              availabilityStyles[
                property.availability
              ]
            }`}
          >
            {property.availability}
          </span>
        </div>

        {/* Category */}
        {property.category?.name && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
              {property.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-1 text-xl font-black text-slate-900">
          {property.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-blue-600" />

          <span className="line-clamp-1">
            {property.address}, {property.city}
          </span>
        </div>

        {/* Property info */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            {property.bedrooms} Beds
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            {property.bathrooms} Baths
          </div>

          <div className="flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            {property.city}
          </div>
        </div>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {property.amenities
              .slice(0, 3)
              .map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {amenity}
                </span>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-blue-600">
              ৳{property.rentAmount.toLocaleString()}
            </p>

            <p className="text-xs text-slate-400">
              per month
            </p>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}