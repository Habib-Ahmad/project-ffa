import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { projectsApi } from "@/api";
import { citiesApi } from "@/api/cities";
import type { UpdateProjectRequest, Project } from "@/interfaces";
import type { City } from "@/interfaces/city";
import { getErrorMessage } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProjectFormValues {
  name: string;
  description: string;
  totalBudget: number;
  startDate: string;
  locationId: number;
}

export default function EditProject() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/projects");
        return;
      }

      try {
        setLoading(true);
        const [projectData, citiesResponse] = await Promise.all([
          projectsApi.getById(parseInt(id)),
          citiesApi.getAll(),
        ]);

        // Only allow editing DRAFT projects
        if (projectData.status !== "DRAFT") {
          toast.error("Only draft projects can be edited");
          navigate(`/projects/${id}`);
          return;
        }

        setProject(projectData);
        setCities(citiesResponse.content);
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        navigate("/projects");
      } finally {
        setLoading(false);
        setLoadingCities(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Project title is required"),
    description: Yup.string().required("Description is required"),
    totalBudget: Yup.number()
      .min(1, "Budget must be greater than 0")
      .required("Budget is required"),
    startDate: Yup.string().required("Start date is required"),
    locationId: Yup.number()
      .min(1, "Please select a location")
      .required("Location is required"),
  });

  const handleSubmit = async (values: EditProjectFormValues) => {
    if (!project) return;

    try {
      await projectsApi.update(project.id, {
        name: values.name,
        description: values.description,
        totalBudget: values.totalBudget,
        startDate: values.startDate,
        locationId: values.locationId,
      });

      toast.success("Project updated successfully");
      navigate(`/projects/${project.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  if (!project) {
    return null;
  }

  const initialValues: EditProjectFormValues = {
    name: project.name,
    description: project.description,
    totalBudget: project.totalBudget,
    startDate: project.startDate,
    locationId: project.location.id,
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
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {t("common.edit")} {t("project.title")}
              </h1>
              <p className="text-muted-foreground mt-1">{project.name}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Label htmlFor="description">{t("project.description")}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="totalBudget">{t("project.totalBudget")}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="startDate">{t("project.startDate")}</Label>
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
                  <p className="text-sm text-destructive">{errors.startDate}</p>
                )}
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
                        loadingCities ? t("common.loading") : "Select a city"
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/projects/${project.id}`)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
