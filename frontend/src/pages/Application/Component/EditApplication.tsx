import { useState } from "react";

import { FaEdit } from "react-icons/fa";
import type { Application } from "@/types/types";
import ApplicationForm from "./ApplicationForm";
import { updateApplication } from "@/api/application";
import { toast } from "sonner";
import { newApplicationSchema } from "../../../validation/validation";
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
import { Button } from "@/components/ui/button";

type props = {
  application: Application;
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
};

const EditApplication = ({ application, setApplications }: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] =
    useState<Application>(application);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = newApplicationSchema.safeParse(applicationData);
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
      await updateApplication(application.id, result.data);
      toast.success("New Application has been added successfully");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === application.id ? { ...app, ...result.data } : app,
        ),
      );

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
        <Button
          onClick={() => console.log(applicationData)}
          variant={"ghost"}
          className="rounded-md p-2 text-space-indigo transition-colors hover:bg-platinum-500"
        >
          <FaEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
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
            formData={applicationData}
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
            {isSubmitting ? "Saving..." : "Update Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplication;
