import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Download, AlertCircle, User, Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
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
import { useState } from "react";
import { toast } from "sonner";

export default function ApplicationDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [replacementReason, setReplacementReason] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock data
  const application = {
    id: id,
    applicantName: "Marie Dubois",
    applicantEmail: "marie.dubois@example.com",
    applicantPhone: "+33 6 12 34 56 78",
    applicantAddress: "45 Rue de la République, 75003 Paris, France",
    projectTitle: "Youth Entrepreneurship Program 2024",
    status: "under_review" as const,
    submittedOn: "2024-01-20",
    score: 85,
    bio: "Experienced entrepreneur with 5 years in sustainable business development. Passionate about creating opportunities for youth in underserved communities.",
  };

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
    
    toast.success(t("application.replacementRequested"));
    setReplacementReason("");
    setSelectedDocument(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{application.applicantName}</h1>
          <p className="text-muted-foreground mt-1">
            {t("nav.applications")} #{application.id}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t("application.profile")}</TabsTrigger>
          <TabsTrigger value="documents">{t("application.documents")}</TabsTrigger>
          <TabsTrigger value="timeline">{t("application.timeline")}</TabsTrigger>
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
                    <p className="text-sm font-medium">{t("application.fullName")}</p>
                    <p className="text-sm text-muted-foreground">{application.applicantName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t("common.email")}</p>
                    <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t("application.phone")}</p>
                    <p className="text-sm text-muted-foreground">{application.applicantPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t("application.address")}</p>
                    <p className="text-sm text-muted-foreground">{application.applicantAddress}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">{t("application.bio")}</p>
                <p className="text-sm text-muted-foreground">{application.bio}</p>
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
                  <p className="text-sm text-muted-foreground">{application.projectTitle}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">{t("application.submittedOn")}</p>
                  <p className="text-sm text-muted-foreground">{application.submittedOn}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">{t("application.score")}</p>
                  <Badge variant="secondary" className="text-sm">
                    {application.score}/100
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
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.fileName} • {doc.size}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("application.uploadedOn")}: {doc.uploadedOn}
                        </p>
                      </div>
                      <Badge
                        variant={doc.status === "approved" ? "default" : "secondary"}
                        className={getStatusColor(doc.status)}
                      >
                        {t(`application.status.${doc.status}`)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t("common.download")}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(doc.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {t("application.requestReplacement")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("application.requestReplacement")}</DialogTitle>
                            <DialogDescription>
                              {t("application.requestReplacementDesc")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">
                                {t("application.documentName")}: {doc.name}
                              </p>
                              <Textarea
                                placeholder={t("application.replacementReason")}
                                value={replacementReason}
                                onChange={(e) => setReplacementReason(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setReplacementReason("")}
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button onClick={handleRequestReplacement}>
                              {t("common.send")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
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
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-8">
                    <p className="font-medium">{t("application.status.submitted")}</p>
                    <p className="text-sm text-muted-foreground">2024-01-20 14:30</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-8">
                    <p className="font-medium">{t("application.status.under_review")}</p>
                    <p className="text-sm text-muted-foreground">2024-01-22 09:15</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-muted" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      {t("application.status.shortlisted")}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("common.pending")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
