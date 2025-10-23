import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, CheckSquare, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/status-badge";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const isIntervener = user?.role === "intervener";

  const recentActivity = [
    {
      id: 1,
      title: "Youth Entrepreneurship Program 2024",
      status: "pending" as const,
      statusLabel: t("project.status.pendingApproval"),
      date: "2024-01-15",
      type: "project",
    },
    {
      id: 2,
      title: "Cultural Exchange Initiative",
      status: "published" as const,
      statusLabel: t("project.status.published"),
      date: "2024-01-14",
      type: "project",
    },
    {
      id: 3,
      title: "Application from Jean Martin",
      status: "review" as const,
      statusLabel: t("application.status.underReview"),
      date: "2024-01-13",
      type: "application",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {t("dashboard.welcome")}, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          {user?.organizationName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title={t("dashboard.myProjects")}
          value={isIntervener ? 12 : 47}
          icon={FolderOpen}
          trend={{ value: "+2 this month", isPositive: true }}
        />
        <StatCard
          title={t("dashboard.pendingApprovals")}
          value={isIntervener ? 3 : 8}
          icon={CheckSquare}
        />
        <StatCard
          title={t("dashboard.applicationsInReview")}
          value={isIntervener ? 24 : 156}
          icon={FileText}
          trend={{ value: "+12 this week", isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <StatusBadge status={item.status} label={item.statusLabel} />
                </div>
              ))}
            </div>
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
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      {t("nav.myProjects")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/applications" className="block">
                  <Button variant="outline" className="w-full justify-between group">
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
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("nav.users")}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/admin/awards" className="block">
                  <Button variant="outline" className="w-full justify-between group">
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
