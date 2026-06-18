import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { STATUS_LABELS } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/types";

type Props = {
  status: ApplicationStatus;
};

const CustomStatusBadge = ({ status }: Props) => {
  if (!status) {
    return;
  }

  const formattedStatus = STATUS_LABELS[status];
  switch (status) {
    case "APPLIED":
      return (
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {formattedStatus}
        </Badge>
      );
    case "INTERVIEWING":
      return (
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          {formattedStatus}
        </Badge>
      );
    case "OFFER":
      return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          {formattedStatus}
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          {formattedStatus}
        </Badge>
      );
  }
};

export default CustomStatusBadge;
