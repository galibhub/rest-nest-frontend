import api from "@/lib/axios";

export interface CreateCheckoutSessionPayload {
  rentalRequestId: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    checkoutUrl: string;
  };
}

export const createCheckoutSession = async (
  payload: CreateCheckoutSessionPayload,
): Promise<CreateCheckoutSessionResponse> => {
  const response =
    await api.post<CreateCheckoutSessionResponse>(
      "/payments/create-checkout-session",
      payload,
    );

  return response.data;
};

export const getAllPayments = async (
  params?: Record<string, string | number>,
) => {
  const response = await api.get("/payments", {
    params,
  });

  return response.data;
};

export const getSinglePayment = async (
  paymentId: string,
) => {
  const response = await api.get(
    `/payments/${paymentId}`,
  );

  return response.data;
};