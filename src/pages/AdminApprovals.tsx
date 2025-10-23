import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminApprovals() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [comments, setComments] = useState("");

  const pendingProjects = [
    {
      id: 1,
      title: "Youth Entrepreneurship Program 2024",
      description: "Supporting young entrepreneurs in francophone communities",
      submittedBy: "Marie Dupont",
      submittedDate: "2024-01-15",
      budget: "$50,000",
      location: "Ottawa, Ontario, Canada",
    },
    {
      id: 2,
      title: "Digital Skills Training Initiative",
      description: "Teaching digital skills to underserved communities",
      submittedBy: "Jean Martin",
      submittedDate: "2024-01-14",
      budget: "$35,000",
      location: "Montreal, Quebec, Canada",
    },
  ];

  const handleApprove = (projectId: number) => {
    toast.success("Project approved and published");
    setSelectedProject(null);
  };

  const handleReject = (projectId: number) => {
    toast.error("Project rejected");
    setSelectedProject(null);
  };

  const handleReturn = (projectId: number) => {
    if (!comments.trim()) {
      toast.error("Please add comments before returning");
      return;
    }
    toast.info("Project returned to intervener with comments");
    setSelectedProject(null);
    setComments("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("admin.approvalQueue")}</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve project submissions from your organization
        </p>
      </div>

      <div className="grid gap-6">
        {pendingProjects.map((project) => (
          <Card key={project.id} className="shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <StatusBadge status="pending" label={t("project.status.pendingApproval")} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Submitted by</p>
                  <p className="font-medium">{project.submittedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{project.submittedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("project.totalBudget")}</p>
                  <p className="font-medium">{project.budget}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>

              {selectedProject === project.id && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("admin.addComments")}</label>
                    <Textarea
                      placeholder="Add comments or feedback..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedProject === project.id ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleApprove(project.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t("admin.approve")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleReturn(project.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("admin.return")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleReject(project.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("admin.reject")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                    >
                      {t("common.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    {t("admin.reviewProject")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingProjects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects pending approval</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
