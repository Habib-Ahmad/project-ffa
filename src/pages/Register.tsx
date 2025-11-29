import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers, FieldProps } from "formik";
import * as Yup from "yup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "@/components/ui/success-modal";
import { authApi } from "@/api";
import type { Institution } from "@/interfaces";
import { getErrorMessage } from "@/lib/utils";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
  organizationId: string;
}

export default function Register() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await authApi.getInstitutions();
        // check if data is an array
        console.log("data", data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid institutions data");
        }
        setInstitutions(data);
      } catch (error) {
        toast.error("Failed to load institutions");
      } finally {
        setLoadingInstitutions(false);
      }
    };
    fetchInstitutions();
  }, []);

  const initialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
    organizationId: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required(t("auth.firstNameRequired") || "First name is required")
      .trim(),
    lastName: Yup.string()
      .required(t("auth.lastNameRequired") || "Last name is required")
      .trim(),
    email: Yup.string()
      .email(t("auth.emailInvalid") || "Please enter a valid email")
      .required(t("auth.emailRequired") || "Email is required"),
    login: Yup.string()
      .required(t("auth.loginRequired") || "Login is required")
      .trim(),
    organizationId: Yup.string().required(
      t("auth.organizationRequired") || "Please select an organization"
    ),
    password: Yup.string()
      .min(
        8,
        t("auth.passwordTooShort") || "Password must be at least 8 characters"
      )
      .matches(
        /[a-z]/,
        t("auth.passwordLowercase") ||
          "Password must contain at least one lowercase letter"
      )
      .matches(
        /[A-Z]/,
        t("auth.passwordUppercase") ||
          "Password must contain at least one uppercase letter"
      )
      .matches(
        /[0-9]/,
        t("auth.passwordNumber") || "Password must contain at least one number"
      )
      .matches(
        /[@$!%*?&#]/,
        t("auth.passwordSpecial") ||
          "Password must contain at least one special character"
      )
      .required(t("auth.passwordRequired") || "Password is required"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        t("auth.passwordMismatch") || "Passwords do not match"
      )
      .required(
        t("auth.confirmPasswordRequired") || "Please confirm your password"
      ),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        login: values.login,
        password: values.password,
        organizationId: parseInt(values.organizationId, 10),
      });

      setShowSuccessModal(true);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const passwordRules = [
    {
      label: t("auth.passwordLength") || "At least 8 characters",
      test: (password: string) => password.length >= 8,
    },
    {
      label: t("auth.passwordLowercase") || "One lowercase letter",
      test: (password: string) => /[a-z]/.test(password),
    },
    {
      label: t("auth.passwordUppercase") || "One uppercase letter",
      test: (password: string) => /[A-Z]/.test(password),
    },
    {
      label: t("auth.passwordNumber") || "One number",
      test: (password: string) => /[0-9]/.test(password),
    },
    {
      label: t("auth.passwordSpecial") || "One special character (@$!%*?&#)",
      test: (password: string) => /[@$!%*?&#]/.test(password),
    },
  ];

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
              {t("auth.register") || "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.registerDescription") ||
                "Enter your details to create a new account"}
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
              {({
                values,
                errors,
                touched,
                isSubmitting,
                isValid,
                setFieldValue,
                setFieldTouched,
              }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {t("auth.firstName") || "First Name"}
                      </Label>
                      <Field
                        as={Input}
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className={
                          touched.firstName && errors.firstName
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-sm text-destructive">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {t("auth.lastName") || "Last Name"}
                      </Label>
                      <Field
                        as={Input}
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        className={
                          touched.lastName && errors.lastName
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-sm text-destructive">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

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
                    <Label htmlFor="login">
                      {t("auth.username") || "Username"}
                    </Label>
                    <Field
                      as={Input}
                      id="login"
                      name="login"
                      type="text"
                      placeholder="username"
                      className={
                        touched.login && errors.login
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {touched.login && errors.login && (
                      <p className="text-sm text-destructive">{errors.login}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationId">
                      {t("auth.organization") || "Embassy/Organization"}
                    </Label>
                    <Select
                      value={values.organizationId}
                      onValueChange={(value) =>
                        setFieldValue("organizationId", value)
                      }
                      disabled={loadingInstitutions}
                    >
                      <SelectTrigger
                        className={
                          touched.organizationId && errors.organizationId
                            ? "border-destructive"
                            : ""
                        }
                        onBlur={() => setFieldTouched("organizationId", true)}
                      >
                        <SelectValue
                          placeholder={
                            loadingInstitutions
                              ? t("common.loading") || "Loading..."
                              : t("auth.selectOrganization") ||
                                "Select an organization"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem
                            key={institution.id}
                            value={String(institution.id)}
                          >
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.organizationId && errors.organizationId && (
                      <p className="text-sm text-destructive">
                        {errors.organizationId}
                      </p>
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

                    {/* Password Rules */}
                    <div className="space-y-1.5 pt-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("auth.passwordRequirements") ||
                          "Password Requirements:"}
                      </p>
                      {passwordRules.map((rule, index) => {
                        const isValid =
                          values.password && rule.test(values.password);
                        return (
                          <div key={index} className="flex items-center gap-2">
                            {isValid ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span
                              className={`text-xs ${
                                isValid
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {rule.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t("auth.confirmPassword") || "Confirm Password"}
                    </Label>
                    <div className="relative">
                      <Field name="confirmPassword">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className={
                              touched.confirmPassword && errors.confirmPassword
                                ? "border-destructive pr-10"
                                : "pr-10"
                            }
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
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
                      : t("auth.register") || "Create Account"}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      {t("auth.alreadyHaveAccount") ||
                        "Already have an account?"}{" "}
                    </span>
                    <Link
                      to="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      {t("auth.login") || "Login"}
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={t("auth.registrationSubmitted") || "Registration Submitted!"}
        description={
          t("auth.registrationPendingMessage") ||
          "Your registration request has been submitted successfully. Your account will be reviewed by an administrator and you will receive an email notification once it has been approved. This process typically takes 1-2 business days."
        }
        confirmText={t("auth.backToLogin") || "Back to Login"}
        onConfirm={() => navigate("/login")}
      />
    </div>
  );
}
