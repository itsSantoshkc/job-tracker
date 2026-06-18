import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Application } from "@/types/types";
import {
  capitalizeFirstLetter,
  formatDate,
  JOB_TYPE_LABELS,
} from "@/lib/utils";
import CustomStatusBadge from "./Component/CustomStatusBadge";

type Props = {
  application: Application;
};

export function ApplicationDetails({ application }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-left cursor-pointer hover:underline text-sm font-medium">
          {capitalizeFirstLetter(application.companyName)}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="p-8 space-y-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Application Details
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Company
              </p>
              <p className="text-base font-medium">
                {capitalizeFirstLetter(application.companyName)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Position
              </p>
              <p className="text-base font-medium">{application.jobTitle}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Status
              </p>
              <p className="text-base font-medium">
                <CustomStatusBadge status={application.status} />
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Job Type
              </p>
              <p className="text-base font-medium">
                {JOB_TYPE_LABELS[application.jobType]}
              </p>
            </div>

            {application.appliedDate && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Applied Date
                </p>
                <p className="text-base font-medium">
                  {formatDate(application.appliedDate)}
                </p>
              </div>
            )}

            {application.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Notes
                </p>
                <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                  {application.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
