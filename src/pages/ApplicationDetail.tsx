import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Download,
  User,
  Mail,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SuccessModal } from "@/components/ui/success-modal";
import { applicationsApi } from "@/api";
import type { Application } from "@/interfaces";
import { getErrorMessage } from "@/lib/utils";

export default function ApplicationDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        navigate("/applications");
        return;
      }

      try {
        setLoading(true);
        const data = await applicationsApi.getById(parseInt(id));
        setApplication(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
        navigate("/applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const documents = [
    {
      id: "1",
      name: "National ID",
      type: "Passport",
      fileName: "passport_marie_dubois.pdf",
      uploadedOn: "2024-01-20",
      status: "approved" as const,
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Business Plan",
      type: "PDF Document",
      fileName: "business_plan_2024.pdf",
      uploadedOn: "2024-01-20",
      status: "pending" as const,
      size: "5.1 MB",
    },
    {
      id: "3",
      name: "Financial Statement",
      type: "Excel Spreadsheet",
      fileName: "financial_statement_2023.xlsx",
      uploadedOn: "2024-01-20",
      status: "pending" as const,
      size: "1.8 MB",
    },
  ];

  const handleRequestReplacement = () => {
    if (!replacementReason.trim()) {
      toast.error(t("application.replacementReasonRequired"));
      return;
    }

    setSuccessMessage({
      title: t("application.replacementRequestedTitle"),
      description: t("application.replacementRequestedDesc"),
    });
    setShowSuccessModal(true);
    setReplacementReason("");
    setSelectedDocument(null);
  };

  const handleApprove = async () => {
    if (!application) return;

    try {
      setProcessing(true);
      await applicationsApi.changeStatus(application.id, "AWARDED");
      setSuccessMessage({
        title: "Application Awarded",
        description:
          "The application has been awarded successfully. The applicant will be notified.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-success";
      case "rejected":
        return "text-destructive";
      default:
        return "text-warning";
    }
  };

  const getStatusValue = (status: string): Status => {
    const statusMap: Record<string, Status> = {
      DRAFT: "draft",
      AWARDED: "awarded",
    };
    return (statusMap[status] || "draft") as Status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{application.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t("nav.applications")} #{application.id}
          </p>
        </div>
        <StatusBadge status={getStatusValue(application.status)} />
      </div>

      {application.status === "DRAFT" && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-medium">
                {t("application.reviewActions")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  onClick={handleApprove}
                  disabled={processing}
                  className="bg-success hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processing ? t("common.loading") : "Award Application"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="profile">{t("application.profile")}</TabsTrigger>
          <TabsTrigger value="documents">
            {t("application.documents")}
          </TabsTrigger>
          <TabsTrigger value="timeline">
            {t("application.timeline")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("application.applicantInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      {t("application.fullName")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.user
                        ? `${application.user.firstName} ${application.user.lastName}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t("common.email")}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      {t("application.location")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.location || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Application Date</p>
                    <p className="text-sm text-muted-foreground">
                      {application.dateApplication}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Motivation</p>
                <p className="text-sm text-muted-foreground">
                  {application.motivation}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  {t("project.description")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {application.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("application.applicationInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">{t("project.title")}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.project?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-muted-foreground">
                    ${application.budget.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Scope</p>
                  <p className="text-sm text-muted-foreground">
                    {application.scope}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {application.startDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {application.endDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Current Step</p>
                  <Badge variant="secondary" className="text-sm">
                    Step {application.currentStep}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("application.uploadedDocuments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.documentsSubmitted &&
                application.documentsSubmitted.length > 0 ? (
                  application.documentsSubmitted.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.documentType.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.path}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No documents submitted
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("application.timeline")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Timeline information will be available soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
      />
    </div>
  );
}
