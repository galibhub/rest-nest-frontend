import api from "@/lib/axios";

import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewsResponse,
  SingleReviewResponse,
} from "@/types/review";

/* =========================================
   GET ALL REVIEWS
========================================= */

export const getAllReviews =
  async (): Promise<ReviewsResponse> => {
    const response =
      await api.get<ReviewsResponse>(
        "/reviews",
      );

    return response.data;
  };

/* =========================================
   GET SINGLE REVIEW
========================================= */

export const getSingleReview =
  async (
    reviewId: string,
  ): Promise<SingleReviewResponse> => {
    const response =
      await api.get<SingleReviewResponse>(
        `/reviews/${reviewId}`,
      );

    return response.data;
  };

/* =========================================
   CREATE REVIEW
========================================= */

export const createReview =
  async (
    payload: CreateReviewPayload,
  ): Promise<SingleReviewResponse> => {
    const response =
      await api.post<SingleReviewResponse>(
        "/reviews",
        payload,
      );

    return response.data;
  };

/* =========================================
   UPDATE REVIEW
========================================= */

export const updateReview =
  async (
    reviewId: string,
    payload: UpdateReviewPayload,
  ): Promise<SingleReviewResponse> => {
    const response =
      await api.patch<SingleReviewResponse>(
        `/reviews/${reviewId}`,
        payload,
      );

    return response.data;
  };

/* =========================================
   DELETE REVIEW
========================================= */

export const deleteReview =
  async (
    reviewId: string,
  ): Promise<SingleReviewResponse> => {
    const response =
      await api.delete<SingleReviewResponse>(
        `/reviews/${reviewId}`,
      );

    return response.data;
  };