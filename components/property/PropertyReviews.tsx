"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Loader2,
  MessageSquare,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";

import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "@/services/review.service";

import type {
  Review,
} from "@/types/review";

interface PropertyReviewsProps {
  propertyId: string;
}

export default function PropertyReviews({
  propertyId,
}: PropertyReviewsProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [rating, setRating] =
    useState<number>(5);

  const [comment, setComment] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editRating, setEditRating] =
    useState<number>(5);

  const [editComment, setEditComment] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response =
        await getAllReviews();

      const propertyReviews =
        (response.data ?? []).filter(
          (review) =>
            review.propertyId ===
            propertyId,
        );

      setReviews(propertyReviews);
    } catch (error: any) {
      console.error(
        "Load reviews error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to load reviews.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating),
      0,
    );

    return total / reviews.length;
  }, [reviews]);

  const myReview = useMemo(() => {
    if (!user?.id) return null;

    return (
      reviews.find(
        (review) =>
          review.tenantId === user.id,
      ) ?? null
    );
  }, [reviews, user?.id]);

  const handleCreateReview = async () => {
    if (!user) {
      toast.error(
        "Please login as a tenant to write a review.",
      );
      return;
    }

    if (user.role !== "TENANT") {
      toast.error(
        "Only tenants can write reviews.",
      );
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error(
        "Rating must be between 1 and 5.",
      );
      return;
    }

    try {
      setSubmitting(true);

      await createReview({
        propertyId,
        rating,
        comment:
          comment.trim() || undefined,
      });

      toast.success(
        "Review submitted successfully.",
      );

      setComment("");
      setRating(5);

      await loadReviews();
    } catch (error: any) {
      console.error(
        "Create review error:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to submit review.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (
    review: Review,
  ) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(
      review.comment ?? "",
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview =
    async () => {
      if (!editingId) return;

      try {
        setSubmitting(true);

        await updateReview(
          editingId,
          {
            rating: editRating,
            comment:
              editComment.trim(),
          },
        );

        toast.success(
          "Review updated successfully.",
        );

        cancelEdit();

        await loadReviews();
      } catch (error: any) {
        console.error(
          "Update review error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to update review.",
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleDeleteReview =
    async (
      reviewId: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this review?",
        );

      if (!confirmed) return;

      try {
        setDeletingId(reviewId);

        await deleteReview(
          reviewId,
        );

        setReviews((current) =>
          current.filter(
            (review) =>
              review.id !== reviewId,
          ),
        );

        toast.success(
          "Review deleted successfully.",
        );
      } catch (error: any) {
        console.error(
          "Delete review error:",
          error,
        );

        toast.error(
          error?.response?.data?.message ??
            "Failed to delete review.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  return (
    <section className="mt-10 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
            Reviews
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Tenant Reviews
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See what tenants say about this property.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />

          <div>
            <p className="text-2xl font-black text-slate-900">
              {averageRating.toFixed(1)}
            </p>

            <p className="text-xs text-slate-500">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user?.role === "TENANT" &&
        !myReview && (
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <h3 className="font-black text-slate-900">
              Write a Review
            </h3>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700">
                Rating
              </p>

              <StarSelector
                value={rating}
                onChange={setRating}
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Share your experience..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={
                handleCreateReview
              }
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        )}

      {/* Active rental restriction */}
      {user?.role === "TENANT" &&
        !myReview && (
          <p className="mt-3 text-xs text-slate-400">
            Only tenants with an active rental
            can submit a review.
          </p>
        )}

      {/* Reviews */}
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading reviews...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-3 font-black text-slate-700">
              No reviews yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Be the first tenant to review this property.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => {
              const isOwner =
                user?.id ===
                review.tenantId;

              const isEditing =
                editingId === review.id;

              return (
                <article
                  key={review.id}
                  className="rounded-2xl border p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <UserRound className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {review.tenant
                            .name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {new Date(
                            review.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isOwner &&
                      !isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                review,
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit review"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              review.id
                            }
                            onClick={() =>
                              handleDeleteReview(
                                review.id,
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete review"
                          >
                            {deletingId ===
                            review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                  </div>

                  {isEditing ? (
                    <div className="mt-5">
                      <StarSelector
                        value={editRating}
                        onChange={
                          setEditRating
                        }
                      />

                      <textarea
                        value={
                          editComment
                        }
                        onChange={(
                          event,
                        ) =>
                          setEditComment(
                            event.target
                              .value,
                          )
                        }
                        rows={4}
                        className="mt-4 w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={
                            submitting
                          }
                          onClick={
                            handleUpdateReview
                          }
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {submitting
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            submitting
                          }
                          onClick={
                            cancelEdit
                          }
                          className="rounded-xl border px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 flex items-center gap-1">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index <
                              review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>

                      {review.comment && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {review.comment}
                        </p>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              onChange(star)
            }
            className="rounded-lg p-1 transition hover:bg-yellow-50"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              }`}
            />
          </button>
        ),
      )}
    </div>
  );
}