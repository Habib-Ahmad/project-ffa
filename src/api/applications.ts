import apiClient from "./config";
import { API_URLS } from "./urls";
import type { Application } from "@/interfaces";

export interface ApplicationsResponse {
  content: Application[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const applicationsApi = {
  getAll: async (): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<{ data: ApplicationsResponse }>(
      API_URLS.APPLICATIONS.LIST
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Application> => {
    const response = await apiClient.get<{ data: Application }>(
      API_URLS.APPLICATIONS.BY_ID(id)
    );
    return response.data.data;
  },

  getByProject: async (projectId: number): Promise<Application[]> => {
    const response = await apiClient.get<{ data: { content: Application[] } }>(
      API_URLS.APPLICATIONS.BY_PROJECT(projectId)
    );
    return response.data.data.content;
  },

  approve: async (id: number): Promise<Application> => {
    const response = await apiClient.put<{ data: Application }>(
      API_URLS.APPLICATIONS.APPROVE(id)
    );
    return response.data.data;
  },

  reject: async (id: number): Promise<Application> => {
    const response = await apiClient.put<{ data: Application }>(
      API_URLS.APPLICATIONS.REJECT(id)
    );
    return response.data.data;
  },

  search: async (query: string): Promise<Application[]> => {
    const response = await apiClient.get<{ data: { content: Application[] } }>(
      API_URLS.APPLICATIONS.SEARCH,
      { params: { query } }
    );
    return response.data.data.content;
  },
};
