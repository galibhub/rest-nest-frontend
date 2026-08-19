export type PropertyAvailability =
  | "AVAILABLE"
  | "RENTED"
  | "UNAVAILABLE";

export interface PropertyCategory {
  id: string;
  name: string;
}

export interface PropertyLandlord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  categoryId: string;
  availability: PropertyAvailability;
  landlordId: string;
  createdAt: string;
  updatedAt: string;

  category?: PropertyCategory;
  landlord?: PropertyLandlord;
}

export interface PropertyMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PropertyListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: PropertyMeta;
    data: Property[];
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}