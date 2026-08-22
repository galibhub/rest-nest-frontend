"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  createProperty,
  getAllCategories,
} from "@/services/property.service";

import type {
  CreatePropertyPayload,
} from "@/types/landlord";

import type { Category } from "@/types/property";

export default function CreatePropertyPage() {
  const router = useRouter();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [amenityInput, setAmenityInput] =
    useState("");

  const [imageInput, setImageInput] =
    useState("");

  const [form, setForm] =
    useState<CreatePropertyPayload>({
      title: "",
      description: "",
      address: "",
      city: "",
      rentAmount: 0,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      images: [],
      categoryId: "",
    });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response =
          await getAllCategories();

        setCategories(
          response.data ?? [],
        );
      } catch (error: any) {
        console.error(
          "Category loading error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load categories.",
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const updateField = <
    K extends keyof CreatePropertyPayload,
  >(
    field: K,
    value: CreatePropertyPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addAmenity = () => {
    const value =
      amenityInput.trim();

    if (!value) return;

    if (form.amenities.includes(value)) {
      return;
    }

    updateField("amenities", [
      ...form.amenities,
      value,
    ]);

    setAmenityInput("");
  };

  const removeAmenity = (
    value: string,
  ) => {
    updateField(
      "amenities",
      form.amenities.filter(
        (item) => item !== value,
      ),
    );
  };

  const addImage = () => {
    const value =
      imageInput.trim();

    if (!value) return;

    if (form.images.includes(value)) {
      return;
    }

    updateField("images", [
      ...form.images,
      value,
    ]);

    setImageInput("");
  };

  const removeImage = (
    value: string,
  ) => {
    updateField(
      "images",
      form.images.filter(
        (item) => item !== value,
      ),
    );
  };

  const validate = () => {
    if (
      form.title.trim().length < 5
    ) {
      toast.error(
        "Title must be at least 5 characters.",
      );
      return false;
    }

    if (
      form.description.trim().length <
      20
    ) {
      toast.error(
        "Description must be at least 20 characters.",
      );
      return false;
    }

    if (!form.address.trim()) {
      toast.error(
        "Address is required.",
      );
      return false;
    }

    if (!form.city.trim()) {
      toast.error(
        "City is required.",
      );
      return false;
    }

    if (form.rentAmount <= 0) {
      toast.error(
        "Rent amount must be greater than 0.",
      );
      return false;
    }

    if (form.bedrooms < 1) {
      toast.error(
        "Bedrooms must be at least 1.",
      );
      return false;
    }

    if (form.bathrooms < 1) {
      toast.error(
        "Bathrooms must be at least 1.",
      );
      return false;
    }

    if (!form.categoryId) {
      toast.error(
        "Please select a category.",
      );
      return false;
    }

    if (form.amenities.length < 1) {
      toast.error(
        "Add at least one amenity.",
      );
      return false;
    }

    if (form.images.length < 1) {
      toast.error(
        "Add at least one image.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      await createProperty(form);

      toast.success(
        "Property created successfully.",
      );

      router.push(
        "/dashboard/landlord/properties",
      );
    } catch (error: any) {
      console.error(
        "Create property error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to create property.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/landlord/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="border-b p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
              Landlord
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Add New Property
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a property listing for tenants.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <Field
              label="Title"
              value={form.title}
              onChange={(value) =>
                updateField(
                  "title",
                  value,
                )
              }
              placeholder="Modern Apartment in Dhanmondi"
            />

            <TextArea
              label="Description"
              value={form.description}
              onChange={(value) =>
                updateField(
                  "description",
                  value,
                )
              }
              placeholder="Describe your property..."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Address"
                value={form.address}
                onChange={(value) =>
                  updateField(
                    "address",
                    value,
                  )
                }
                placeholder="Road 15, Dhanmondi"
              />

              <Field
                label="City"
                value={form.city}
                onChange={(value) =>
                  updateField(
                    "city",
                    value,
                  )
                }
                placeholder="Dhaka"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <NumberField
                label="Rent Amount"
                value={form.rentAmount}
                onChange={(value) =>
                  updateField(
                    "rentAmount",
                    value,
                  )
                }
              />

              <NumberField
                label="Bedrooms"
                value={form.bedrooms}
                onChange={(value) =>
                  updateField(
                    "bedrooms",
                    value,
                  )
                }
              />

              <NumberField
                label="Bathrooms"
                value={form.bathrooms}
                onChange={(value) =>
                  updateField(
                    "bathrooms",
                    value,
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </label>

              <select
                value={form.categoryId}
                onChange={(event) =>
                  updateField(
                    "categoryId",
                    event.target.value,
                  )
                }
                disabled={
                  loadingCategories
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
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

            <TagInput
              label="Amenities"
              value={amenityInput}
              setValue={setAmenityInput}
              items={form.amenities}
              addItem={addAmenity}
              removeItem={removeAmenity}
              placeholder="WiFi"
            />

            <TagInput
              label="Image URLs"
              value={imageInput}
              setValue={setImageInput}
              items={form.images}
              addItem={addImage}
              removeItem={removeImage}
              placeholder="https://example.com/image.jpg"
            />

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Property...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Property
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) =>
          onChange(
            Number(event.target.value),
          )
        }
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function TagInput({
  label,
  value,
  setValue,
  items,
  addItem,
  removeItem,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  items: string[];
  addItem: () => void;
  removeItem: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={addItem}
          className="rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-800"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"
          >
            {item}

            <button
              type="button"
              onClick={() =>
                removeItem(item)
              }
              className="hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}