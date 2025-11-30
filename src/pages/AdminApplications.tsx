import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminApplications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real API call
  const applications = [
    {
      id: 1,
      title: "Community Arts Center Proposal",
      projectName: "Youth Entrepreneurship Program 2024",
      applicant: "John Smith",
      submittedOn: "2024-01-20",
      status: "submitted",
      budget: 45000,
    },
    {
      id: 2,
      title: "Tech Education Initiative",
      projectName: "Educational Technology Grant",
      applicant: "Sarah Johnson",
      submittedOn: "2024-01-22",
      status: "under_review",
      budget: 28000,
    },
    {
      id: 3,
      title: "Cultural Exchange Program",
      projectName: "Cultural Exchange Initiative",
      applicant: "Marie Dubois",
      submittedOn: "2024-01-25",
      status: "shortlisted",
      budget: 35000,
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("nav.applications")}</h1>
          <p className="text-muted-foreground mt-1">
            Review all project applications
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t("common.filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {application.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Project: {application.projectName}
                      </p>
                    </div>
                    <StatusBadge status={application.status as Status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">
                        {t("application.applicant")}
                      </p>
                      <p className="font-medium">{application.applicant}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("application.submittedOn")}
                      </p>
                      <p className="font-medium">{application.submittedOn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("application.budget")}
                      </p>
                      <p className="font-medium">
                        ${application.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/applications/${application.id}`)
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("common.viewDetails")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
