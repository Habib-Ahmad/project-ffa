import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  FileText,
  CheckSquare,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import { projectsApi, applicationsApi } from "@/api";
import type { Project } from "@/interfaces";
import type { Application } from "@/interfaces";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const isIntervener = user?.role === "intervener";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, applicationsData] = await Promise.all([
          projectsApi.getAll(),
          applicationsApi.getAll(),
        ]);
        setProjects(projectsData.content);
        setApplications(applicationsData.content);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingProjects = projects.filter(
    (p) => p.status === "DRAFT" || p.status === "PENDING_APPROVAL",
  ).length;
  const totalProjects = projects.length;
  const applicationsInReview = applications.filter(
    (a) => a.status === "DRAFT",
  ).length;

  const getRecentActivity = () => {
    const items: Array<{
      id: number | string;
      title: string;
      status: "pending" | "published" | "review" | "approved" | "rejected";
      statusLabel: string;
      date: string;
      type: string;
    }> = [];

    // Add recent projects
    projects.slice(0, 2).forEach((project) => {
      items.push({
        id: project.id,
        title: project.name,
        status: project.status === "DRAFT" ? "pending" : "published",
        statusLabel: project.status,
        date: new Date(project.creationDate).toLocaleDateString(),
        type: "project",
      });
    });

    // Add recent applications
    applications.slice(0, 1).forEach((app) => {
      items.push({
        id: app.id,
        title: `Application #${app.id}`,
        status: app.status === "DRAFT" ? "review" : "approved",
        statusLabel: app.status,
        date: new Date(app.dateApplication).toLocaleDateString(),
        type: "application",
      });
    });

    return items.slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {t("dashboard.welcome")}, {user?.name}
        </h1>
        <p className="text-muted-foreground">{user?.organizationName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title={t("dashboard.myProjects")}
          value={totalProjects}
          icon={FolderOpen}
        />
        <StatCard
          title={t("dashboard.pendingApprovals")}
          value={pendingProjects}
          icon={CheckSquare}
        />
        <StatCard
          title={t("dashboard.applicationsInReview")}
          value={applicationsInReview}
          icon={FileText}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("common.loading")}</p>
              </div>
            ) : getRecentActivity().length > 0 ? (
              <div className="space-y-4">
                {getRecentActivity().map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <StatusBadge
                      status={item.status}
                      label={item.statusLabel}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isIntervener ? (
              <>
                <Link to="/projects/new" className="block">
                  <Button className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t("dashboard.createProject")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/projects" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      {t("nav.myProjects")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/applications" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("nav.applications")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin/approvals" className="block">
                  <Button className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      {t("nav.approvals")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/admin/users" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("nav.users")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/admin/awards" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("nav.awards")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
