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
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { applicationsApi } from "@/api";
import type { Application } from "@/interfaces";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export default function Applications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsApi.getAll();

      // Filter to only show applications for the logged-in intervener's projects
      setApplications(response.content);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusValue = (status: string): Status => {
    const statusMap: Record<string, Status> = {
      DRAFT: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    return (statusMap[status] || "pending") as Status;
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
                <SelectItem value="DRAFT">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
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
    </div>
  );
}
