export interface City {
  id: number;
  name: string;
  postalCode: number;
  departmentId: number;
  creationDate: string;
  lastModificationDate: string;
  creatorUser: any | null;
  lastModificatorUser: any | null;
  isDeleted: boolean;
  department: any | null;
  embassies: any | null;
  institutions: any | null;
}

export interface CitiesResponse {
  content: City[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
