import apiClient from "./config";
import { API_URLS } from "./urls";
import type { Institution } from "@/interfaces";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: {
      id: number;
      name: string;
    };
    organizationId: number;
    organizationType: string;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  password: string;
  organizationId: number;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>(
      API_URLS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      API_URLS.AUTH.REGISTER,
      userData
    );
    return response.data;
  },

  getInstitutions: async (): Promise<Institution[]> => {
    const response = await apiClient.get<{ data: { content: Institution[] } }>(
      API_URLS.PUBLIC.INSTITUTIONS
    );
    return response.data.data.content;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.LOGOUT
    );
    localStorage.removeItem("authToken");
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(
      API_URLS.AUTH.REFRESH
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.RESET_PASSWORD,
      { token, newPassword }
    );
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.VERIFY_EMAIL,
      { token }
    );
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.RESEND_VERIFICATION,
      { email }
    );
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_URLS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    return response.data;
  },

  getMe: async (): Promise<LoginResponse["user"]> => {
    const response = await apiClient.get<LoginResponse["user"]>(
      API_URLS.AUTH.ME
    );
    return response.data;
  },
};
