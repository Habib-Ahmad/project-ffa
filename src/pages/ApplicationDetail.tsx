import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
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

  const getStatusValue = (status: string): Status => {
    const statusMap: Record<string, Status> = {
      DRAFT: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    return (statusMap[status] || "pending") as Status;
  };

  const getStatusDisplay = (status: string): string => {
    const statusMap: Record<string, string> = {
      DRAFT: "Under Review",
      APPROVED: "Approved",
      REJECTED: "Rejected",
    };
    return statusMap[status] || status;
  };

  const handleApprove = async () => {
    if (!application) return;

    try {
      setProcessing(true);
      const updatedApplication = await applicationsApi.approve(application.id);
      setApplication(updatedApplication);
      setSuccessMessage({
        title: "Application Approved",
        description:
          "The application has been approved successfully. The applicant will be notified.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;

    try {
      setProcessing(true);
      const updatedApplication = await applicationsApi.reject(application.id);
      setApplication(updatedApplication);
      setSuccessMessage({
        title: "Application Rejected",
        description:
          "The application has been rejected. The applicant will be notified.",
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
          <h1 className="text-3xl font-bold">Application #{application.id}</h1>
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
                  {processing ? t("common.loading") : "Approve Application"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={processing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {processing ? t("common.loading") : "Reject Application"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("application.applicationInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Application ID</p>
              <p className="text-sm text-muted-foreground">{application.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Application Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(application.dateApplication).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant="secondary" className="text-sm">
                {getStatusDisplay(application.status)}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Motivation</p>
            <p className="text-sm text-muted-foreground">
              {application.motivation}
            </p>
          </div>
        </CardContent>
      </Card>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
      />
    </div>
  );
}
