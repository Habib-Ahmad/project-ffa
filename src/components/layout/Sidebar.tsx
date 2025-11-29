import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  FileText,
  MessageSquare,
  CheckSquare,
  Database,
  Users,
  FileSearch,
  Award,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const intervenerLinks = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard"), end: true },
    {
      to: "/projects",
      icon: FolderOpen,
      label: t("nav.myProjects"),
      end: true,
    },
    { to: "/projects/new", icon: Plus, label: t("nav.newProject"), end: true },
    {
      to: "/applications",
      icon: FileText,
      label: t("nav.applications"),
      end: true,
    },
    {
      to: "/messages",
      icon: MessageSquare,
      label: t("nav.messages"),
      end: true,
    },
  ];

  const adminLinks = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard"), end: true },
    {
      to: "/admin/approvals",
      icon: CheckSquare,
      label: t("nav.approvals"),
      end: true,
    },
    {
      to: "/admin/catalogs",
      icon: Database,
      label: t("nav.catalogs"),
      end: true,
    },
    { to: "/admin/users", icon: Users, label: t("nav.users"), end: true },
    { to: "/admin/awards", icon: Award, label: t("nav.awards"), end: true },
    { to: "/admin/audit", icon: FileSearch, label: t("nav.audit"), end: true },
  ];

  const links = user?.role === "admin" ? adminLinks : intervenerLinks;

  return (
    <aside className={cn("w-64 border-r bg-card flex flex-col", className)}>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted p-3 text-xs">
          <p className="font-medium mb-1">
            {user?.role === "admin" ? "Admin" : "Intervener"}
          </p>
          <p className="text-muted-foreground line-clamp-2">
            {user?.organizationName}
          </p>
        </div>
      </div>
    </aside>
  );
}
