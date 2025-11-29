import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers, FieldProps } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api";
import { getErrorMessage } from "@/lib/utils";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { setUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("auth.emailInvalid") || "Please enter a valid email")
      .required(t("auth.emailRequired") || "Email is required"),
    password: Yup.string().required(
      t("auth.passwordRequired") || "Password is required"
    ),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await authApi.login({
        login: values.email,
        password: values.password,
      });

      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      setUser({
        id: response.user.id.toString(),
        email: response.user.email,
        name: `${response.user.firstName} ${response.user.lastName}`,
        role:
          response.user.role.name.toLowerCase() === "admin"
            ? "admin"
            : "intervener",
        organizationId: response.user.organizationId.toString(),
        organizationName: "",
      });

      navigate("/");
      toast.success(t("auth.loginSuccess") || "Login successful");
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          >
            {language === "en" ? "FR" : "EN"}
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("auth.login") || "Login"}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.loginDescription") ||
                "Enter your credentials to access the FFA Staff Portal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ values, errors, touched, isSubmitting, isValid }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className={
                        touched.email && errors.email
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {touched.email && errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {t("auth.password") || "Password"}
                    </Label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className={
                              touched.password && errors.password
                                ? "border-destructive pr-10"
                                : "pr-10"
                            }
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting
                      ? t("common.loading") || "Loading..."
                      : t("auth.login") || "Login"}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      {t("auth.dontHaveAccount") || "Don't have an account?"}{" "}
                    </span>
                    <Link
                      to="/register"
                      className="text-primary hover:underline font-medium"
                    >
                      {t("auth.register") || "Create Account"}
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
