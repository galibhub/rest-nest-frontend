import api from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  AuthUser,
} from "@/types/auth";

interface RawLoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response =
    await api.post<RawLoginResponse>(
      "/auth/login",
      payload,
    );

  const raw = response.data;

  const data = raw.data ?? {};

  const accessToken =
    data.accessToken ??
    data.token ??
    raw.data?.access_token;

  const refreshToken =
    data.refreshToken ??
    data.refresh_token;

  const user: AuthUser =
    data.user ??
    data.userData ??
    {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      profile: data.profile,
    };

  if (!accessToken) {
    throw new Error(
      "Login successful but access token was not returned by the server.",
    );
  }

  return {
    success: raw.success,
    statusCode: raw.statusCode,
    message: raw.message,
    data: {
      accessToken,
      refreshToken,
      user,
    },
  };
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};