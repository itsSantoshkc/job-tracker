import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

type Props = { id: string };

const DeleteApplication = ({ id }: Props) => {
  return (
    <Button
      onClick={() => console.log(id)}
      className="cursor-pointer rounded-md bg-platinum-900 p-2 text-flag-red transition-colors hover:bg-flag-red-900"
      title="Delete"
    >
      <FaTrash />
    </Button>
  );
};

export default DeleteApplication;
