import { z } from "zod";

export const newApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobType: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME"]),
  status: z.enum(["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]),
  appliedDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});
