import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteApplication } from "@/api/application";

type Props = {
  id: string;
  companyName: string;
  onDelete?: (id: string) => void;
};

const DeleteApplication = ({ id, companyName, onDelete }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!id || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteApplication(id);

      onDelete?.(id);

      toast.success(`${companyName} application deleted`);
    } catch (error) {
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="cursor-pointer rounded-md bg-platinum-900 p-2 text-flag-red transition-colors hover:bg-flag-red-900"
          title="Delete"
        >
          <FaTrash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Application?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete your application for{" "}
            <strong>{companyName}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteApplication;
