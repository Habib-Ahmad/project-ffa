import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SuccessModal } from "@/components/ui/success-modal";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { projectsApi } from "@/api";
import { citiesApi } from "@/api/cities";
import type { CreateProjectRequest } from "@/interfaces";
import type { City } from "@/interfaces/city";
import { getErrorMessage } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFormValues {
  name: string;
  description: string;
  status: string;
  totalBudget: number;
  startDate: string;
  submissionDate: string;
  locationId: number;
}

export default function NewProject() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [documentRequirements, setDocumentRequirements] = useState<
    Array<{ category: string; type: string; mandatory: boolean }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await citiesApi.getAll();
        setCities(response.content);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const initialValues: ProjectFormValues = {
    name: "",
    description: "",
    status: "DRAFT",
    totalBudget: 0,
    startDate: "",
    submissionDate: "",
    locationId: 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
    totalBudget: Yup.number()
      .min(1, "Budget must be greater than 0")
      .required("Budget is required"),
    startDate: Yup.string().required("Start date is required"),
    submissionDate: Yup.string().required("Submission date is required"),
    locationId: Yup.number()
      .min(1, "Please select a location")
      .required("Location is required"),
  });

  const steps = [
    { key: "basics", label: t("project.basics") },
    { key: "budget", label: t("project.budget") },
    // { key: "documents", label: t("project.documents") }, // TODO: Uncomment when backend implements document upload
    { key: "review", label: t("project.review") },
  ];

  const documentCategories = [
    "Identity Documents",
    "Financial Documents",
    "Legal Documents",
    "Academic Documents",
    "Professional Documents",
  ];

  const documentTypes: Record<string, string[]> = {
    "Identity Documents": [
      "Passport",
      "National ID",
      "Driver's License",
      "Birth Certificate",
    ],
    "Financial Documents": [
      "Bank Statement",
      "Tax Return",
      "Proof of Income",
      "Financial Report",
    ],
    "Legal Documents": [
      "Business Registration",
      "Articles of Incorporation",
      "Legal Certificate",
    ],
    "Academic Documents": ["Diploma", "Transcript", "Certificate", "Degree"],
    "Professional Documents": [
      "Resume/CV",
      "Reference Letter",
      "Portfolio",
      "Work Certificate",
    ],
  };

  const addDocumentRequirement = () => {
    if (selectedCategory && selectedType) {
      setDocumentRequirements([
        ...documentRequirements,
        {
          category: selectedCategory,
          type: selectedType,
          mandatory: isMandatory,
        },
      ]);
      setSelectedCategory("");
      setSelectedType("");
      setIsMandatory(false);
    }
  };

  const removeDocumentRequirement = (index: number) => {
    setDocumentRequirements(documentRequirements.filter((_, i) => i !== index));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSaveDraft = async (values: ProjectFormValues) => {
    try {
      await projectsApi.create({
        name: values.name,
        description: values.description,
        status: "DRAFT",
        totalBudget: values.totalBudget,
        startDate: values.startDate,
        submissionDate: values.submissionDate,
        locationId: values.locationId,
      });
      toast.success("Draft saved successfully");
      navigate("/projects");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      await projectsApi.create({
        name: values.name,
        description: values.description,
        status: "PENDING_APPROVAL",
        totalBudget: values.totalBudget,
        startDate: values.startDate,
        submissionDate: values.submissionDate,
        locationId: values.locationId,
      });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{t("project.createNew")}</h1>
              <p className="text-muted-foreground mt-1">
                Step {currentStep + 1} of {steps.length}:{" "}
                {steps[currentStep].label}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <span
                  key={step.key}
                  className={
                    index === currentStep ? "text-primary font-medium" : ""
                  }
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
                    <Label htmlFor="name">{t("project.projectTitle")}</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Enter project title"
                      className={
                        touched.name && errors.name ? "border-destructive" : ""
                      }
                    />
                    {touched.name && errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {t("project.description")}
                    </Label>
                    <Field name="description">
                      {({ field }: FieldProps) => (
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Describe your project"
                          rows={6}
                          className={
                            touched.description && errors.description
                              ? "border-destructive"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    {touched.description && errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        {t("project.startDate")}
                      </Label>
                      <Field
                        as={Input}
                        id="startDate"
                        name="startDate"
                        type="date"
                        className={
                          touched.startDate && errors.startDate
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {touched.startDate && errors.startDate && (
                        <p className="text-sm text-destructive">
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="submissionDate">Submission Date</Label>
                      <Field
                        as={Input}
                        id="submissionDate"
                        name="submissionDate"
                        type="date"
                        className={
                          touched.submissionDate && errors.submissionDate
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {touched.submissionDate && errors.submissionDate && (
                        <p className="text-sm text-destructive">
                          {errors.submissionDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locationId">{t("project.location")}</Label>
                    <Select
                      value={String(values.locationId)}
                      onValueChange={(value) =>
                        setFieldValue("locationId", parseInt(value))
                      }
                      disabled={loadingCities}
                    >
                      <SelectTrigger
                        className={
                          touched.locationId && errors.locationId
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue
                          placeholder={
                            loadingCities
                              ? t("common.loading")
                              : "Select a city"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name} - {city.postalCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.locationId && errors.locationId && (
                      <p className="text-sm text-destructive">
                        {errors.locationId}
                      </p>
                    )}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalBudget">
                      {t("project.totalBudget")}
                    </Label>
                    <Field
                      as={Input}
                      id="totalBudget"
                      name="totalBudget"
                      type="number"
                      placeholder="Enter total budget"
                      className={
                        touched.totalBudget && errors.totalBudget
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {touched.totalBudget && errors.totalBudget && (
                      <p className="text-sm text-destructive">
                        {errors.totalBudget}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("project.documentRequirements")}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="docCategory">
                        {t("project.documentCategory")}
                      </Label>
                      <select
                        id="docCategory"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedType("");
                        }}
                      >
                        <option value="">Select category</option>
                        {documentCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docType">
                        {t("project.documentType")}
                      </Label>
                      <select
                        id="docType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        disabled={!selectedCategory}
                      >
                        <option value="">Select type</option>
                        {selectedCategory &&
                          documentTypes[selectedCategory]?.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mandatory"
                        checked={isMandatory}
                        onCheckedChange={(checked) =>
                          setIsMandatory(checked === true)
                        }
                      />
                      <Label htmlFor="mandatory" className="cursor-pointer">
                        {t("project.mandatory")}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      onClick={addDocumentRequirement}
                      disabled={!selectedCategory || !selectedType}
                    >
                      {t("project.addDocument")}
                    </Button>
                  </div>

                  {documentRequirements.length > 0 && (
                    <div className="space-y-2">
                      <Label>Added Requirements:</Label>
                      <div className="space-y-2">
                        {documentRequirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div>
                              <span className="font-medium">{req.type}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({req.category})
                              </span>
                              {req.mandatory && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {t("project.mandatory")}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDocumentRequirement(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Project Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Title:</span>{" "}
                        {values.name || "[Not set]"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Description:
                        </span>{" "}
                        {values.description || "[Not set]"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        {values.status || "[Not set]"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Budget:</span> $
                        {values.totalBudget || 0}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>{" "}
                        {values.startDate || "[Not set]"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Submission Date:
                        </span>{" "}
                        {values.submissionDate || "[Not set]"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Location:</span>{" "}
                        {values.locationId
                          ? cities.find((c) => c.id === values.locationId)
                              ?.name +
                              " - " +
                              cities.find((c) => c.id === values.locationId)
                                ?.postalCode || "[Not set]"
                          : "[Not set]"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t("common.previous")}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSaveDraft(values)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t("common.saveDraft")}
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={handleNext}>
                      {t("common.next")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t("common.loading") : t("common.submit")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <SuccessModal
            open={showSuccessModal}
            onOpenChange={setShowSuccessModal}
            title={t("project.submitSuccess")}
            description={t("project.submitSuccessDescription")}
            onConfirm={() => navigate("/projects")}
            confirmText={t("common.viewProjects")}
          />
        </Form>
      )}
    </Formik>
  );
}
