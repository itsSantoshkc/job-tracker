import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import type { Application, ApplicationStatus } from "@/types/types";
import { applicationsData } from "../data";
import { APPLICATION_STATUS_OPTIONS } from "../types/types";
import AddApplication from "./Application/Component/AddApplication";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ApplicationList = () => {
  const [applications, setApplications] = useState<Application[] | any>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = (searchParams.get("status") as ApplicationStatus) || "";
  const currentSearch = searchParams.get("search") || "";

  const searchRef = useRef<HTMLInputElement | null>(null);
  //   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setApplications(applicationsData);
  }, []);

  function handleSearch(e: SubmitEvent) {
    e.preventDefault();
    const searchValue = searchRef?.current?.value;
    if (searchValue) {
      updateParams({ search: searchValue });
    }
  }

  function updateParams(updates: Record<string, string>) {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (updates.status !== undefined || updates.search !== undefined) {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50">
      {/* Header */}
      <div className="w-full max-w-5xl mt-10 flex flex-col gap-4">
        <div className="flex justify-between my-2 items-center">
          <h1 className="text-4xl  font-bold">Application Tracker</h1>
          <AddApplication />
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <Select
            onValueChange={(e) => updateParams({ status: e })}
            value={currentStatus}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Status</SelectItem>
                {APPLICATION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <form
            className="flex gap-3 items-center w-full pl-10"
            onSubmit={() => handleSearch}
          >
            <input
              type="text"
              ref={searchRef}
              placeholder="Search applications..."
              className="w-full"
            />
            <Button variant={"secondary"} className="w-28">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-5xl mt-6 flex justify-center">
        <div className="w-full bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader className="bg-platinum-500">
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.companyName}
                  </TableCell>
                  <TableCell>{application.role}</TableCell>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
