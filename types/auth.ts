export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
  phone?: string;
  profilePhoto?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  profilePhoto?: string | null;
  bio?: string | null;
  userId: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: string;
  profile?: UserProfile | null;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: AuthUser;
  };
}