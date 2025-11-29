import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectsApi } from "@/api";
import type { Project } from "@/interfaces";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export default function Projects() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll();
        setProjects(response.content);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
                <SelectItem value="DRAFT">
                  {t("project.status.draft")}
                </SelectItem>
                <SelectItem value="PENDING_APPROVAL">
                  {t("project.status.pendingApproval")}
                </SelectItem>
                <SelectItem value="PUBLISHED">
                  {t("project.status.published")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("common.loading")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {t("project.totalBudget")}
                        </p>
                        <p className="font-medium">
                          ${project.totalBudget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("project.startDate")}
                        </p>
                        <p className="font-medium">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {project.location?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applications</p>
                        <p className="font-medium">
                          {project.applications?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {t("common.viewDetails")}
                      </Button>
                      {project.status === "DRAFT" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            navigate(`/projects/${project.id}/edit`)
                          }
                        >
                          {t("common.edit")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t("common.noData")}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
