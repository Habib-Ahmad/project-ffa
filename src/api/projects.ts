import apiClient from "./config";
import { API_URLS } from "./urls";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/interfaces";

export interface ProjectsResponse {
  content: Project[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const projectsApi = {
  getAll: async (): Promise<ProjectsResponse> => {
    const response = await apiClient.get<{ data: ProjectsResponse }>(
      API_URLS.PROJECTS.LIST
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<{ data: Project }>(
      API_URLS.PROJECTS.BY_ID(id)
    );
    return response.data.data;
  },

  create: async (projectData: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<{ data: Project }>(
      API_URLS.PROJECTS.CREATE,
      projectData
    );
    return response.data.data;
  },

  update: async (
    id: number,
    projectData: UpdateProjectRequest
  ): Promise<Project> => {
    const response = await apiClient.put<{ data: Project }>(
      API_URLS.PROJECTS.UPDATE(id),
      projectData
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_URLS.PROJECTS.DELETE(id));
  },

  changeStatus: async (id: number, status: string): Promise<Project> => {
    const response = await apiClient.put<{ data: Project }>(
      `${API_URLS.PROJECTS.BY_ID(id)}/status`,
      null,
      { params: { status } }
    );
    return response.data.data;
  },

  search: async (query: string): Promise<Project[]> => {
    const response = await apiClient.get<{ data: { content: Project[] } }>(
      API_URLS.PROJECTS.SEARCH,
      { params: { query } }
    );
    return response.data.data.content;
  },
};
