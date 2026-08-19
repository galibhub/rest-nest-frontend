"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PropertyCard from "@/components/property/PropertyCard";

import {
  getAllCategories,
  getAllProperties,
} from "@/services/property.service";

import type {
  Category,
  Property,
} from "@/types/property";

export default function PropertiesPage() {
  const [properties, setProperties] =
    useState<Property[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          propertyResponse,
          categoryResponse,
        ] = await Promise.all([
          getAllProperties(),
          getAllCategories(),
        ]);

        // IMPORTANT:
        // Backend response:
        // response.data.data = {
        //   meta,
        //   data: properties
        // }

        setProperties(
          propertyResponse?.data?.data ?? [],
        );

        setCategories(
          categoryResponse?.data ?? [],
        );
      } catch (error) {
        console.error(
          "Property loading error:",
          error,
        );

        toast.error(
          "Failed to load properties.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProperties =
    useMemo(() => {
      return properties.filter(
        (property) => {
          const searchText =
            search.toLowerCase();

          const matchesSearch =
            !search ||
            property.title
              .toLowerCase()
              .includes(searchText) ||
            property.city
              .toLowerCase()
              .includes(searchText) ||
            property.address
              .toLowerCase()
              .includes(searchText);

          const matchesCategory =
            !categoryId ||
            property.categoryId ===
              categoryId;

          const matchesMin =
            !minPrice ||
            property.rentAmount >=
              Number(minPrice);

          const matchesMax =
            !maxPrice ||
            property.rentAmount <=
              Number(maxPrice);

          return (
            matchesSearch &&
            matchesCategory &&
            matchesMin &&
            matchesMax
          );
        },
      );
    }, [
      properties,
      search,
      categoryId,
      minPrice,
      maxPrice,
    ]);

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b bg-gradient-to-br from-blue-50 via-white to-emerald-50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
              RentNest Properties
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">
              Find your perfect place
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Browse available rental properties
              and find a home that fits your
              lifestyle.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters */}
            <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-blue-600" />

                  <h2 className="font-black">
                    Filters
                  </h2>
                </div>

                {(search ||
                  categoryId ||
                  minPrice ||
                  maxPrice) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-5">
                {/* Search */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Search
                  </label>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search by title or city"
                      className="w-full rounded-xl border px-4 py-3 pl-10 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Property Type
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value,
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      All Types
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price Range
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value,
                        )
                      }
                      placeholder="Min"
                      className="w-full rounded-xl border px-3 py-3 outline-none focus:border-blue-500"
                    />

                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value,
                        )
                      }
                      placeholder="Max"
                      className="w-full rounded-xl border px-3 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Available listings
                  </p>

                  <h2 className="text-2xl font-black text-slate-900">
                    {filteredProperties.length}{" "}
                    properties
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Explore available rentals
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-96 items-center justify-center rounded-3xl border bg-white">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading properties...
                  </div>
                </div>
              ) : filteredProperties.length ===
                0 ? (
                <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
                  <X className="mx-auto h-8 w-8 text-slate-300" />

                  <h3 className="mt-4 text-xl font-black">
                    No properties found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    There are currently no
                    properties matching your
                    filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProperties.map(
                    (property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}