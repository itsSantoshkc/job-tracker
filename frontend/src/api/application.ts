import axios from "axios";
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationQueryParams,
  PaginatedResponse,
} from "../types/types.ts";

const api = axios.create({
  baseURL: "http://localhost:3000/applications",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export async function getApplications(
  params: ApplicationQueryParams = {},
): Promise<PaginatedResponse<Application>> {
  const { data } = await api.get<PaginatedResponse<Application>>("", {
    params,
  });
  return data;
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await api.get<Application>(`/${id}`);
  return data;
}

export async function createApplication(
  input: CreateApplicationInput,
): Promise<Application> {
  const { data } = await api.post<Application>("", input);
  return data;
}

export async function updateApplication(
  id: string,
  input: UpdateApplicationInput,
): Promise<Application> {
  const { data } = await api.patch<Application>(`/${id}`, input);
  return data;
}

export async function deleteApplication(id: string): Promise<Application> {
  const { data } = await api.delete<Application>(`/${id}`);
  return data;
}
