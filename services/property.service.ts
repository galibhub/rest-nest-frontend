import api from "@/lib/axios";

import type {
  PropertyListResponse,
  CategoryResponse,
} from "@/types/property";

import type {
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "@/types/landlord";

export const getAllProperties = async (
  params?: Record<string, string | number>,
): Promise<PropertyListResponse> => {
  const response =
    await api.get<PropertyListResponse>(
      "/properties",
      {
        params,
      },
    );

  return response.data;
};

export const getAllCategories =
  async (): Promise<CategoryResponse> => {
    const response =
      await api.get<CategoryResponse>(
        "/categories",
      );

    return response.data;
  };

export const getSingleProperty = async (
  id: string,
) => {
  const response = await api.get(
    `/properties/${id}`,
  );

  return response.data;
};

export const createProperty = async (
  payload: CreatePropertyPayload,
) => {
  const response = await api.post(
    "/properties",
    payload,
  );

  return response.data;
};

export const updateProperty = async (
  id: string,
  payload: UpdatePropertyPayload,
) => {
  const response = await api.patch(
    `/properties/${id}`,
    payload,
  );

  return response.data;
};

export const deleteProperty = async (
  id: string,
) => {
  const response = await api.delete(
    `/properties/${id}`,
  );

  return response.data;
};