export type PropertyAvailability =
  | "AVAILABLE"
  | "RENTED"
  | "UNAVAILABLE";

export interface LandlordProperty {
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

  category?: {
    id: string;
    name: string;
  };

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
  };
}

export interface CreatePropertyPayload {
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
}

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  rentAmount?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  categoryId?: string;
}

export interface LandlordRequest {
  id: string;
  moveInDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
  };

  property: {
    id: string;
    title: string;
    city: string;
    rentAmount: number;
    availability:
      | "AVAILABLE"
      | "RENTED"
      | "UNAVAILABLE";
  };
}

export interface LandlordPayment {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string | null;
  createdAt: string;

  rentalRequest?: {
    id: string;

    tenant?: {
      id: string;
      name: string;
      email: string;
    };

    property?: {
      id: string;
      title: string;
      rentAmount: number;
    };
  };
}