export interface DocumentType {
  id: number;
  name: string;
  projectId: number;
}

export interface DocumentSubmitted {
  id: number;
  path: string;
  documentTypeId: number;
  applicationId: number;
  documentType: DocumentType;
}

export type ApplicationStatus = "DRAFT" | "APPROVED" | "REJECTED";

export interface Application {
  id: number;
  dateApplication: string;
  motivation: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  scope: string;
  budget: number;
  startDate: string;
  endDate: string;
  locationId: number;
  currentStep: number;
  userId: number;
  projectId: number;
  documentsSubmitted: DocumentSubmitted[];
  location: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface Location {
  id: number;
  name: string;
  postalCode: number;
  departmentId: number;
}

export type ProjectStatus = "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED";

export interface Project {
  id: number;
  name: string;
  description: string;
  submissionDate: string;
  status: ProjectStatus;
  totalBudget: number;
  startDate: string;
  locationId: number;
  intervenerId: number;
  winnerUserId: number | null;
  creationDate: string;
  lastModificationDate: string;
  isDeleted: boolean;
  intervener: string | null;
  winnerUser: unknown | null;
  applications: Application[] | null;
  location: Location;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: string;
  totalBudget: number;
  startDate: string;
  submissionDate: string;
  locationId: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  totalBudget?: number;
  startDate?: string;
  submissionDate?: string;
  locationId?: number;
  status?: string;
}
