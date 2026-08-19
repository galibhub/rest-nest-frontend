import api from "@/lib/axios";
import type {
  PropertyListResponse,
  CategoryResponse,
} from "@/types/property";

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