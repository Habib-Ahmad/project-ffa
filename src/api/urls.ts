export const API_URLS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    CHANGE_PASSWORD: "/auth/change-password",
    ME: "/auth/me",
  },

  PUBLIC: {
    INSTITUTIONS: "/public/institutions",
    CITIES: "/public/cities",
  },

  PROJECTS: {
    LIST: "ffaAPI/intervener/projects",
    BY_ID: (id: number) => `ffaAPI/intervener/projects/${id}`,
    CREATE: "ffaAPI/intervener/projects",
    UPDATE: (id: number) => `ffaAPI/intervener/projects/${id}`,
    DELETE: (id: number) => `ffaAPI/intervener/projects/${id}`,
    SEARCH: "ffaAPI/intervener/projects/search",
  },
} as const;
