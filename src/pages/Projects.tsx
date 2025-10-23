import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Projects() {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Youth Entrepreneurship Program 2024",
      description: "Supporting young entrepreneurs in francophone communities",
      status: "pending" as const,
      statusLabel: t("project.status.pendingApproval"),
      budget: "$50,000",
      startDate: "2024-02-01",
      location: "Ottawa, Ontario, Canada",
      applicationsCount: 0,
    },
    {
      id: 2,
      title: "Cultural Exchange Initiative",
      description: "Promoting cultural exchange between French-speaking regions",
      status: "published" as const,
      statusLabel: t("project.status.published"),
      budget: "$75,000",
      startDate: "2024-01-15",
      location: "Montreal, Quebec, Canada",
      applicationsCount: 24,
    },
    {
      id: 3,
      title: "Educational Technology Grant",
      description: "Funding for educational technology in schools",
      status: "draft" as const,
      statusLabel: t("project.status.draft"),
      budget: "$30,000",
      startDate: "2024-03-01",
      location: "Toronto, Ontario, Canada",
      applicationsCount: 0,
    },
  ];

  const filteredProjects = statusFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("nav.myProjects")}</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your project proposals
          </p>
        </div>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("nav.newProject")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t("common.filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">{t("project.status.draft")}</SelectItem>
                <SelectItem value="pending">{t("project.status.pendingApproval")}</SelectItem>
                <SelectItem value="published">{t("project.status.published")}</SelectItem>
                <SelectItem value="closed">{t("project.status.closed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <StatusBadge status={project.status} label={project.statusLabel} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("project.totalBudget")}</p>
                      <p className="font-medium">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("project.startDate")}</p>
                      <p className="font-medium">{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Applications</p>
                      <p className="font-medium">{project.applicationsCount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      {t("common.viewDetails")}
                    </Button>
                    {project.status === "draft" && (
                      <Button size="sm" variant="default">
                        {t("common.edit")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProjects.length === 0 && (
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
