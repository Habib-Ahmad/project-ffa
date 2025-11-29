import api from "./config";
import { API_URLS } from "./urls";
import type { City, CitiesResponse } from "@/interfaces/city";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status: number;
}

export const citiesApi = {
  getAll: async (page = 0, size = 100): Promise<CitiesResponse> => {
    const response = await api.get<ApiResponse<CitiesResponse>>(
      `${API_URLS.PUBLIC.CITIES}?page=${page}&size=${size}`
    );
    return response.data.data;
  },
};
