import type { ApplicationStatus, JobType } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  INTERNSHIP: "Internship",
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  REJECTED: "Rejected",
  OFFER: "Offer",
};
