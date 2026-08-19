import api from "@/lib/axios";

export interface CreateRentalRequestPayload {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export interface RentalRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    moveInDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;

    tenant: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      role: string;
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

    message?: string | null;
  };
}

export interface LandlordRentalRequest {
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

export interface LandlordRentalRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LandlordRentalRequest[];
}

// ===============================
// Create Rental Request - TENANT
// ===============================

export const createRentalRequest = async (
  payload: CreateRentalRequestPayload,
): Promise<RentalRequestResponse> => {
  const response =
    await api.post<RentalRequestResponse>(
      "/rental-requests",
      payload,
    );

  return response.data;
};

// ===============================
// Get Landlord Rental Requests
// ===============================

export const getLandlordRentalRequests =
  async (): Promise<LandlordRentalRequestsResponse> => {
    const response =
      await api.get<LandlordRentalRequestsResponse>(
        "/rental-requests/landlord",
      );

    return response.data;
  };

// ===============================
// Approve Rental Request
// ===============================

export const approveRentalRequest = async (
  requestId: string,
) => {
  const response = await api.patch(
    `/rental-requests/${requestId}/approve`,
  );

  return response.data;
};

// ===============================
// Reject Rental Request
// ===============================

export const rejectRentalRequest = async (
  requestId: string,
) => {
  const response = await api.patch(
    `/rental-requests/${requestId}/reject`,
  );

  return response.data;
};