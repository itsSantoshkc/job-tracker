import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AddApplicationInput } from "../types";
import { newApplicationSchema } from "../validation";

const AddApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<AddApplicationInput>({
    companyName: "",
    jobTitle: "",
    jobType: "FULL_TIME",
    status: "APPLIED",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Validate the data
    const result = newApplicationSchema.safeParse(formData);

    if (!result.success) {
      // 2. Map Zod errors to your error state
      const formattedErrors = result.error.flatten().fieldErrors;

      // Transform { field: ["error message"] } to { field: "error message" }
      const errorMap: Record<string, string> = {};
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (value) errorMap[key] = value[0];
      });

      setErrors(errorMap);
      setIsSubmitting(false);
      return; // Stop submission if invalid
    }

    // 3. Clear errors and proceed if valid
    setErrors({});
    try {
      console.log("Submitting validated data:", result.data);
      // await yourApiCall(result.data);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Application</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
          <DialogDescription>
            Fill in the details to track a new job application.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-application-form"
          onSubmit={handleSubmit}
          className="grid gap-5 py-4"
        >
          <div className="grid gap-5">
            <div className="grid gap-1.5">
              <Label htmlFor="companyName">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="e.g. Google"
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-xs text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="jobTitle">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                placeholder="e.g. Software Engineer"
                className={errors.jobTitle ? "border-red-500" : ""}
              />
              {errors.jobTitle && (
                <p className="text-xs text-red-500">{errors.jobTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="jobType">Job Type</Label>
                <select
                  id="jobType"
                  value={formData.jobType}
                  onChange={(e) => handleChange("jobType", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input
                id="appliedDate"
                type="date"
                value={formData.appliedDate}
                className={errors.companyName ? "border-red-500" : ""}
                onChange={(e) => handleChange("appliedDate", e.target.value)}
              />
              {errors.appliedDate && (
                <p className="text-xs text-red-500">{errors.appliedDate}</p>
              )}
            </div>

            {/* Notes */}
            <div className="grid gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Optional notes about this application..."
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="add-application-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Add New Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplication;
