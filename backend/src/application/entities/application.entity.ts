export interface ApplicationEntity {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: string;
  status: string;
  appliedDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
