"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  getSingleProperty,
  getAllCategories,
  updateProperty,
} from "@/services/property.service";

import type {
  Category,
  Property,
} from "@/types/property";

import type {
  UpdatePropertyPayload,
} from "@/types/landlord";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [property, setProperty] =
    useState<Property | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [amenityInput, setAmenityInput] =
    useState("");

  const [imageInput, setImageInput] =
    useState("");

  const [form, setForm] =
    useState<UpdatePropertyPayload>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          propertyResponse,
          categoryResponse,
        ] = await Promise.all([
          getSingleProperty(id),
          getAllCategories(),
        ]);

        const data =
          propertyResponse?.data;

        setProperty(data);

        setCategories(
          categoryResponse?.data ?? [],
        );

        setForm({
          title: data.title,
          description:
            data.description,
          address: data.address,
          city: data.city,
          rentAmount: Number(
            data.rentAmount,
          ),
          bedrooms: Number(
            data.bedrooms,
          ),
          bathrooms: Number(
            data.bathrooms,
          ),
          amenities:
            data.amenities ?? [],
          images: data.images ?? [],
          categoryId:
            data.categoryId,
        });
      } catch (error: any) {
        console.error(
          "Load property error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to load property.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const updateField = <
    K extends keyof UpdatePropertyPayload,
  >(
    field: K,
    value: UpdatePropertyPayload[K],
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

    const current =
      form.amenities ?? [];

    if (current.includes(value)) {
      return;
    }

    updateField("amenities", [
      ...current,
      value,
    ]);

    setAmenityInput("");
  };

  const removeAmenity = (
    value: string,
  ) => {
    updateField(
      "amenities",
      (form.amenities ?? []).filter(
        (item) => item !== value,
      ),
    );
  };

  const addImage = () => {
    const value =
      imageInput.trim();

    if (!value) return;

    const current =
      form.images ?? [];

    if (current.includes(value)) {
      return;
    }

    updateField("images", [
      ...current,
      value,
    ]);

    setImageInput("");
  };

  const removeImage = (
    value: string,
  ) => {
    updateField(
      "images",
      (form.images ?? []).filter(
        (item) => item !== value,
      ),
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateProperty(
        id,
        form,
      );

      toast.success(
        "Property updated successfully.",
      );

      router.push(
        "/dashboard/landlord/properties",
      );
    } catch (error: any) {
      console.error(
        "Update property error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to update property.",
      );
    } finally {
      setSaving(false);
    }
  };

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

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-black">
            Property not found
          </h1>

          <Link
            href="/dashboard/landlord/properties"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Back to Properties
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

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
              Edit Property
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your property information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <Field
              label="Title"
              value={form.title ?? ""}
              onChange={(value) =>
                updateField(
                  "title",
                  value,
                )
              }
            />

            <TextArea
              label="Description"
              value={
                form.description ?? ""
              }
              onChange={(value) =>
                updateField(
                  "description",
                  value,
                )
              }
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Address"
                value={form.address ?? ""}
                onChange={(value) =>
                  updateField(
                    "address",
                    value,
                  )
                }
              />

              <Field
                label="City"
                value={form.city ?? ""}
                onChange={(value) =>
                  updateField(
                    "city",
                    value,
                  )
                }
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <NumberField
                label="Rent Amount"
                value={
                  form.rentAmount ?? 1
                }
                onChange={(value) =>
                  updateField(
                    "rentAmount",
                    value,
                  )
                }
              />

              <NumberField
                label="Bedrooms"
                value={
                  form.bedrooms ?? 1
                }
                onChange={(value) =>
                  updateField(
                    "bedrooms",
                    value,
                  )
                }
              />

              <NumberField
                label="Bathrooms"
                value={
                  form.bathrooms ?? 1
                }
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
                value={
                  form.categoryId ?? ""
                }
                onChange={(event) =>
                  updateField(
                    "categoryId",
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  Select category
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
              items={
                form.amenities ?? []
              }
              addItem={addAmenity}
              removeItem={removeAmenity}
              placeholder="WiFi"
            />

            <TagInput
              label="Image URLs"
              value={imageInput}
              setValue={setImageInput}
              items={form.images ?? []}
              addItem={addImage}
              removeItem={removeImage}
              placeholder="https://example.com/image.jpg"
            />

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}