import api from "@/lib/axios";

import type {
  AdminUser,
  AdminProperty,
  AdminRentalRequest,
  UserStatus,
} from "@/types/admin";

/* =========================================
   USER MANAGEMENT
========================================= */

export const getAllUsers = async (): Promise<
  AdminUser[]
> => {
  const response = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: AdminUser[];
  }>("/users");

  return response.data.data;
};

export const updateUserStatus = async (
  userId: string,
  status: UserStatus,
): Promise<AdminUser> => {
  const response = await api.patch<{
    success: boolean;
    statusCode: number;
    message: string;
    data: AdminUser;
  }>(
    `/users/${userId}/status`,
    {
      status,
    },
  );

  return response.data.data;
};

/* =========================================
   PROPERTY MANAGEMENT
========================================= */

export const getAllAdminProperties = async (): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: AdminProperty[];
}> => {
  const response = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: AdminProperty[];
  }>("/properties/admin", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return {
    meta: response.data.meta,
    data: response.data.data,
  };
};

/* =========================================
   RENTAL REQUEST MANAGEMENT
========================================= */

export const getAllAdminRentalRequests =
  async (): Promise<{
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: AdminRentalRequest[];
  }> => {
    const response = await api.get<{
      success: boolean;
      statusCode: number;
      message: string;
      meta: {
        page: number;
        limit: number;
        total: number;
      };
      data: AdminRentalRequest[];
    }>("/rentals/admin", {
      params: {
        page: 1,
        limit: 100,
      },
    });

    return {
      meta: response.data.meta,
      data: response.data.data,
    };
  };

/* =========================================
   PAYMENT MANAGEMENT
========================================= */

export const getAllAdminPayments = async () => {
  const response = await api.get(
    "/payments",
    {
      params: {
        page: 1,
        limit: 100,
      },
    },
  );

  return response.data;
};