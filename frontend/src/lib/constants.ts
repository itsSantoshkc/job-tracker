import type { ApplicationStatus, JobType } from "../api/types";

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  APPLIED: {
    label: "Applied",
    color: "text-space-indigo",
    bgColor: "bg-space-indigo-900",
  },
  INTERVIEWING: {
    label: "Interviewing",
    color: "text-lavender-grey-300",
    bgColor: "bg-lavender-grey-800",
  },
  OFFER: {
    label: "Offer",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-flag-red",
    bgColor: "bg-flag-red-900",
  },
};

export const TOAST_OPTS = {
  duration: 3000,
  style: {
    background: "#2b2d42",
    color: "#edf2f4",
    fontSize: "14px",
  },
  success: {
    iconTheme: {
      primary: "#059669",
      secondary: "#edf2f4",
    },
  },
  error: {
    iconTheme: {
      primary: "#d90429",
      secondary: "#edf2f4",
    },
  },
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  INTERNSHIP: "Internship",
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
