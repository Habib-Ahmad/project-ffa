import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { applicationsApi } from "@/api";
import type { Application } from "@/interfaces";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Applications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsApi.getAll();
      console.log("Applications fetched:", response);

      // Filter to only show applications for the logged-in intervener's projects
      setApplications(response.content);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      setProcessing(true);
      const updatedApplication = await applicationsApi.approve(
        selectedApplication.id
      );
      console.log("Application approved:", updatedApplication);

      // Update the application in the list
      setApplications((prev) =>
        prev.map((app) =>
          app.id === updatedApplication.id ? updatedApplication : app
        )
      );

      toast.success("Application approved successfully");
      setSelectedApplication(null);
      setActionType(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;

    try {
      setProcessing(true);
      const updatedApplication = await applicationsApi.reject(
        selectedApplication.id
      );
      console.log("Application rejected:", updatedApplication);

      // Update the application in the list
      setApplications((prev) =>
        prev.map((app) =>
          app.id === updatedApplication.id ? updatedApplication : app
        )
      );

      toast.success("Application rejected successfully");
      setSelectedApplication(null);
      setActionType(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const openActionDialog = (
    application: Application,
    action: "approve" | "reject"
  ) => {
    setSelectedApplication(application);
    setActionType(action);
  };

  const getStatusValue = (status: string): Status => {
    const statusMap: Record<string, Status> = {
      DRAFT: "draft",
      AWARDED: "awarded",
    };
    return (statusMap[status] || "draft") as Status;
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      app.motivation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("nav.applications")}</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage applications to your projects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by motivation..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="AWARDED">Awarded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          Application #{application.id}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Motivation:</span>{" "}
                          {application.motivation || "No motivation provided"}
                        </p>
                      </div>
                      <StatusBadge
                        status={getStatusValue(application.status)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">User ID:</span>{" "}
                        {application.userId}
                      </div>
                      <div>
                        <span className="font-medium">Project ID:</span>{" "}
                        {application.projectId}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>{" "}
                        {new Date(
                          application.dateApplication
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/applications/${application.id}`)
                      }
                    >
                      View Details
                    </Button>
                    {application.status === "DRAFT" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            openActionDialog(application, "approve")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openActionDialog(application, "reject")
                          }
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredApplications.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No applications found matching your filters.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog
        open={!!actionType}
        onOpenChange={() => {
          setActionType(null);
          setSelectedApplication(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} Application #
              {selectedApplication?.id}? This will notify the applicant.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setSelectedApplication(null);
              }}
              disabled={processing}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={actionType === "approve" ? handleApprove : handleReject}
              disabled={processing}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {processing
                ? t("common.loading")
                : actionType === "approve"
                ? "Approve"
                : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
