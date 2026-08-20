import api from "@/lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  AuthUser,
} from "@/types/auth";

export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      payload,
    );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      payload,
    );

  return response.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    user: AuthUser;
  }>("/auth/me");

  return response.data.user;
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch {
    return null;
  }
};