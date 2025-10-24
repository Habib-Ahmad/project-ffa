import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Applications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const applications: Array<{
    id: string;
    projectTitle: string;
    applicantName: string;
    applicantEmail: string;
    organization: string;
    status: Status;
    submittedDate: string;
    score: number | null;
  }> = [
    {
      id: "1",
      projectTitle: "Youth Entrepreneurship Program 2024",
      applicantName: "Marie Dubois",
      applicantEmail: "marie.dubois@example.com",
      organization: "Innovation Hub",
      status: "under_review",
      submittedDate: "2024-01-20",
      score: 8.5,
    },
    {
      id: "2",
      projectTitle: "Education Initiative",
      applicantName: "Jean Martin",
      applicantEmail: "jean.martin@example.com",
      organization: "Education for All",
      status: "shortlisted",
      submittedDate: "2024-01-18",
      score: 9.2,
    },
    {
      id: "3",
      projectTitle: "Youth Entrepreneurship Program 2024",
      applicantName: "Sophie Laurent",
      applicantEmail: "sophie.laurent@example.com",
      organization: "Tech Startup Lab",
      status: "submitted",
      submittedDate: "2024-01-22",
      score: null,
    },
    {
      id: "4",
      projectTitle: "Community Development Fund",
      applicantName: "Pierre Lefebvre",
      applicantEmail: "pierre.lefebvre@example.com",
      organization: "Local Development Association",
      status: "award_recommended",
      submittedDate: "2024-01-15",
      score: 9.5,
    },
  ];

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

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
                placeholder="Search by applicant name, email, or organization..." 
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="award_recommended">Award Recommended</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                      <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
                      <p className="text-sm font-medium mt-1">{application.organization}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Project:</span> {application.projectTitle}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {application.submittedDate}
                    </div>
                    {application.score && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Score:</span>
                        <Badge variant={application.score >= 9 ? "default" : "secondary"}>
                          {application.score}/10
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/applications/${application.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No applications found matching your filters.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
