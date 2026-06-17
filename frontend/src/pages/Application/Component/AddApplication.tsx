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
import type { AddApplicationInput } from "../types";
import { newApplicationSchema } from "../validation";
import { createApplication } from "@/api/application";
import { toast } from "sonner";
import type { Application } from "@/types/types";
import ApplicationForm from "./ApplicationForm";

type Props = {
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
};

const AddApplication = ({ setApplications }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = newApplicationSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (value) errorMap[key] = value[0];
      });

      setErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    try {
      const dataToSubmit = {
        ...result.data,
        appliedDate: new Date(result.data.appliedDate).toISOString(),
      };
      await createApplication(dataToSubmit);
      toast.success("New Application has been added successfully");
      const optimisticEntry = {
        ...result.data,
        id: crypto.randomUUID(), // Temporary ID for UI rendering
      } as Application;
      setApplications((prev) => [optimisticEntry, ...prev]);
      setFormData({
        companyName: "",
        jobTitle: "",
        jobType: "FULL_TIME",
        status: "APPLIED",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setIsOpen(false);
    } catch (err) {
      toast.error("Unable to add new application");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-lg"} className="px-4 font-bold  p-2 w-44">
          Add Application
        </Button>
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
          <ApplicationForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
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
