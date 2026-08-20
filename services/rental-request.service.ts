import api from "@/lib/axios";

export interface CreateRentalRequestPayload {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface RentalRequestProperty {
  id: string;
  title: string;
  address?: string;
  city: string;
  rentAmount: number;
  availability:
    | "AVAILABLE"
    | "RENTED"
    | "UNAVAILABLE";
}

export interface RentalRequestPayment {
  id: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED";
  paidAt?: string | null;
}

export interface TenantRentalRequest {
  id: string;
  moveInDate: string;
  status: RentalRequestStatus;
  createdAt: string;

  property: RentalRequestProperty & {
    landlord?: {
      id: string;
      name: string;
      email: string;
    };
  };

  payment?: RentalRequestPayment | null;
}

export interface CreateRentalRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
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
    };

    property: RentalRequestProperty;

    message?: string | null;
  };
}

export interface TenantRentalRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TenantRentalRequest[];
}

export interface LandlordRentalRequest {
  id: string;
  moveInDate: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  createdAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
  };

  property: RentalRequestProperty;
}

export interface LandlordRentalRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LandlordRentalRequest[];
}

// Create
export const createRentalRequest = async (
  payload: CreateRentalRequestPayload,
): Promise<CreateRentalRequestResponse> => {
  const response =
    await api.post<CreateRentalRequestResponse>(
      "/rentals",
      payload,
    );

  return response.data;
};

// Tenant requests
export const getTenantRentalRequests =
  async (): Promise<TenantRentalRequestsResponse> => {
    const response =
      await api.get<TenantRentalRequestsResponse>(
        "/rentals/tenant",
      );

    return response.data;
  };

// Landlord requests
export const getLandlordRentalRequests =
  async (): Promise<LandlordRentalRequestsResponse> => {
    const response =
      await api.get<LandlordRentalRequestsResponse>(
        "/rentals/landlord",
      );

    return response.data;
  };

// Approve
export const approveRentalRequest = async (
  requestId: string,
) => {
  const response = await api.patch(
    `/rentals/${requestId}/approve`,
  );

  return response.data;
};

// Reject
export const rejectRentalRequest = async (
  requestId: string,
) => {
  const response = await api.patch(
    `/rentals/${requestId}/reject`,
  );

  return response.data;
};