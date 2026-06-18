import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getApplications } from "@/api/application";
import {
  capitalizeFirstLetter,
  formatDate,
  JOB_TYPE_LABELS,
} from "@/lib/utils";
import { APPLICATION_STATUS_OPTIONS } from "@/types/types";
import type {
  Application,
  ApplicationQueryParams,
  ApplicationStatus,
} from "@/types/types";

import AddApplication from "./Component/AddApplication";
import EditApplication from "./Component/EditApplication";
import DeleteApplication from "./Component/DeleteApplication";
import { Pagination } from "./Component/Pagination";
import ApplicationLoading from "./Component/ApplicationLoading";
import { ApplicationDetails } from "./ApplicationDetails";
import CustomStatusBadge from "./Component/CustomStatusBadge";

const ApplicationList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState({
    applications: [] as Application[],
    meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: true,
  });

  const currentStatus = (searchParams.get("status") as ApplicationStatus) || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      value ? newParams.set(key, value) : newParams.delete(key);
    });

    if (updates.status !== undefined || updates.search !== undefined) {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const fetchApplications = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const params: ApplicationQueryParams = {
        page: currentPage,
        limit: 10,
        ...(currentStatus && { status: currentStatus }),
        ...(currentSearch && { search: currentSearch }),
      };

      const result = await getApplications(params);
      setState({
        applications: result.data,
        meta: result.meta,
        isLoading: false,
      });
    } catch {
      toast.error("Failed to load applications");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [currentPage, currentStatus, currentSearch]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onDelete = async (id: string) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.filter((app) => app.id !== id),
    }));

    try {
      await fetchApplications();
    } catch (error) {
      toast.error("Item deleted, but failed to refresh list.");
    }
  };

  const onNewApplication = async () => {
    await fetchApplications();
  };
  const emptyRows = Math.max(0, 10 - state.applications.length);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 px-4 sm:px-6">
      <title>Application Tracker System</title>
      <div className="w-full max-w-5xl mt-6 sm:mt-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 my-2 sm:items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Application Tracker
          </h1>
          <AddApplication onNewApplication={onNewApplication} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select
            value={currentStatus}
            onValueChange={(value) => updateParams({ status: value })}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Default Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Default Status</SelectItem>
                {APPLICATION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <form
            className="flex gap-3 items-center w-full sm:flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              updateParams({ search: searchInput });
            }}
          >
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-lavender-grey-800 bg-white py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-space-indigo"
            />
            <Button
              type="submit"
              variant="secondary"
              size="icon-lg"
              className="shrink-0 w-24 sm:w-28"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-6 mx-auto flex justify-center">
        <div className="w-full bg-white rounded-lg shadow-sm border overflow-x-auto">
          <Table className="min-w-160">
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
              {state.isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <ApplicationLoading key={i} />
                ))
              ) : state.applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {state.applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        <ApplicationDetails application={app} />
                      </TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(app.jobTitle)}
                      </TableCell>
                      <TableCell>{JOB_TYPE_LABELS[app.jobType]}</TableCell>
                      <TableCell>
                        <CustomStatusBadge status={app.status} />
                      </TableCell>
                      <TableCell>{formatDate(app.appliedDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <EditApplication
                            application={app}
                            setApplications={(updater) =>
                              setState((prev) => ({
                                ...prev,
                                applications:
                                  typeof updater === "function"
                                    ? updater(prev.applications)
                                    : updater,
                              }))
                            }
                          />
                          <DeleteApplication
                            id={app.id}
                            companyName={app.companyName}
                            onDelete={onDelete}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {Array.from({ length: emptyRows }).map((_, i) => (
                    <TableRow key={`empty-${i}`}>
                      <TableCell className="h-13.25">&nbsp;</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={state.meta.page}
        totalPages={state.meta.totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />
    </div>
  );
};

export default ApplicationList;
