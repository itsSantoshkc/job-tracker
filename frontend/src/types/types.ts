export const APPLICATION_STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export type JobType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME";

export type ApplicationStatus =
  (typeof APPLICATION_STATUS_OPTIONS)[number]["value"];

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface CreateApplicationInput {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
}

export interface UpdateApplicationInput {
  companyName?: string;
  jobTitle?: string;
  jobType?: JobType;
  status?: ApplicationStatus;
  appliedDate?: string;
  notes?: string;
}

export interface ApplicationQueryParams {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}
