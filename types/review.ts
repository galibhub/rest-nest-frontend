export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface ReviewTenant {
  id: string;
  name: string;
  email: string;
}

export interface ReviewProperty {
  id: string;
  title: string;
  city: string;
}

export interface Review {
  id: string;

  tenantId: string;

  propertyId: string;

  rating: number;

  comment?: string | null;

  createdAt: string;

  updatedAt: string;

  tenant: ReviewTenant;

  property: ReviewProperty;
}

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review[];
}

export interface SingleReviewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review;
}