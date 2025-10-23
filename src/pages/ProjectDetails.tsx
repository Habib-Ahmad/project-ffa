import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

export default function ProjectDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - will be replaced with real data
  const project = {
    id: id,
    title: "Youth Entrepreneurship Program 2024",
    description: "Supporting young entrepreneurs in developing sustainable businesses",
    status: "published" as const,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    budget: "$500,000",
    applicationsCount: 12,
  };

  const applicants = [
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@example.com",
      submittedOn: "2024-01-20",
      status: "submitted" as const,
      score: null,
    },
    {
      id: "2",
      name: "Jean Martin",
      email: "jean.martin@example.com",
      submittedOn: "2024-01-22",
      status: "under_review" as const,
      score: 85,
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie.laurent@example.com",
      submittedOn: "2024-01-25",
      status: "shortlisted" as const,
      score: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-1">{t("project.title")} #{project.id}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("project.totalBudget")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.budget}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("common.date")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {project.startDate} - {project.endDate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("nav.applications")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.applicationsCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("project.description")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("project.applicants")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("application.applicant")}</TableHead>
                <TableHead>{t("application.submittedOn")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("application.score")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {applicant.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{applicant.submittedOn}</TableCell>
                  <TableCell>
                    <StatusBadge status={applicant.status} />
                  </TableCell>
                  <TableCell>
                    {applicant.score ? (
                      <Badge variant="secondary">{applicant.score}/100</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/applications/${applicant.id}`)}
                    >
                      {t("common.viewDetails")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
