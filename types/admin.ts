export type UserStatus = "ACTIVE" | "BLOCKED";

export type PropertyAvailability =
  | "AVAILABLE"
  | "RENTED"
  | "UNAVAILABLE";

export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "LANDLORD" | "TENANT";
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  rentAmount: number;
  availability: PropertyAvailability;
  landlord: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    status: UserStatus;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface AdminRentalRequest {
  id: string;
  moveInDate: string;
  status: RentalRequestStatus;
  createdAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    status: UserStatus;
  };

  property: {
    id: string;
    title: string;
    address: string;
    city: string;
    rentAmount: number;
    availability: PropertyAvailability;

    landlord: {
      id: string;
      name: string;
      email: string;
    };
  };

  payment?: {
    id: string;
    amount: number;
    provider: "STRIPE" | "SSLCOMMERZ";
    status: PaymentStatus;
    paidAt?: string | null;
  } | null;
}