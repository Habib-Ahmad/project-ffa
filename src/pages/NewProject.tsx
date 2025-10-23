import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NewProject() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { key: "basics", label: t("project.basics") },
    { key: "scope", label: t("project.scope") },
    { key: "budget", label: t("project.budget") },
    { key: "geography", label: t("project.geography") },
    { key: "review", label: t("project.review") },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully");
  };

  const handleSubmit = () => {
    toast.success("Project submitted for approval");
    navigate("/projects");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{t("project.createNew")}</h1>
          <p className="text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          {steps.map((step, index) => (
            <span
              key={step.key}
              className={index === currentStep ? "text-primary font-medium" : ""}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">{t("project.projectTitle")}</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("project.description")}</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t("project.startDate")}</Label>
                  <Input
                    id="startDate"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t("project.endDate")}</Label>
                  <Input
                    id="endDate"
                    type="date"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scope">{t("project.scope")}</Label>
                <Textarea
                  id="scope"
                  placeholder="Define the project scope and objectives"
                  rows={8}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">{t("project.totalBudget")}</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter total budget"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t("project.country")}</Label>
                  <Input id="country" placeholder="Select country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">{t("project.region")}</Label>
                  <Input id="region" placeholder="Select region" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t("project.department")}</Label>
                  <Input id="department" placeholder="Select department" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t("project.city")}</Label>
                  <Input id="city" placeholder="Select city" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Project Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Title:</span> [Project Title]</p>
                  <p><span className="text-muted-foreground">Budget:</span> $[Amount]</p>
                  <p><span className="text-muted-foreground">Location:</span> [Country, Region]</p>
                  <p><span className="text-muted-foreground">Duration:</span> [Start] - [End]</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("common.previous")}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                {t("common.saveDraft")}
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  {t("common.next")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  {t("common.submit")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
