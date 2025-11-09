import apiClient from "./config";
import { API_URLS } from "./urls";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "intervener" | "admin";
    organizationId: string;
    organizationName: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // const response = await apiClient.post<LoginResponse>(API_URLS.AUTH.LOGIN, credentials);
    // return response.data;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({
            user: {
              id: "1",
              name: "Marie Dupont",
              email: credentials.email,
              role: "intervener",
              organizationId: "org-1",
              organizationName: "French Embassy - Ottawa",
            },
            token: "mock-jwt-token-12345",
            refreshToken: "mock-refresh-token-67890",
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    // const response = await apiClient.post<RegisterResponse>(API_URLS.AUTH.REGISTER, userData);
    // return response.data;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password) {
          resolve({
            message:
              "Registration successful. Your account is pending approval.",
            userId: "new-user-" + Date.now(),
          });
        } else {
          reject(new Error("Invalid registration data"));
        }
      }, 1000);
    });
  },

  logout: async (): Promise<{ message: string }> => {
    // const response = await apiClient.post<{ message: string }>(API_URLS.AUTH.LOGOUT);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("authToken");
        resolve({ message: "Logged out successfully" });
      }, 500);
    });
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    // const response = await apiClient.post<{ token: string }>(API_URLS.AUTH.REFRESH_TOKEN, { refreshToken });
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: "new-mock-jwt-token-" + Date.now() });
      }, 500);
    });
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    // const response = await apiClient.post<{ message: string }>(API_URLS.AUTH.FORGOT_PASSWORD, data);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "Password reset email sent. Please check your inbox.",
        });
      }, 1000);
    });
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    // const response = await apiClient.post<{ message: string }>(API_URLS.AUTH.RESET_PASSWORD, data);
    // return response.data;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.token && data.newPassword) {
          resolve({ message: "Password reset successful" });
        } else {
          reject(new Error("Invalid reset data"));
        }
      }, 1000);
    });
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    // const response = await apiClient.post<{ message: string }>(API_URLS.AUTH.VERIFY_EMAIL, { token });
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Email verified successfully" });
      }, 1000);
    });
  },
};
