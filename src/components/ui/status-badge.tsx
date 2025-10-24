import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Status = "draft" | "pending" | "published" | "closed" | "archived" | 
              "submitted" | "review" | "shortlisted" | "awarded" | "declined" |
              "under_review" | "award_recommended";

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-warning/10 text-warning border-warning/20",
  published: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
  submitted: "bg-primary/10 text-primary border-primary/20",
  review: "bg-warning/10 text-warning border-warning/20",
  under_review: "bg-warning/10 text-warning border-warning/20",
  shortlisted: "bg-accent/10 text-accent border-accent/20",
  awarded: "bg-success/10 text-success border-success/20",
  award_recommended: "bg-success/10 text-success border-success/20",
  declined: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<Status, string> = {
  draft: "Draft",
  pending: "Pending",
  published: "Published",
  closed: "Closed",
  archived: "Archived",
  submitted: "Submitted",
  review: "In Review",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  awarded: "Awarded",
  award_recommended: "Award Recommended",
  declined: "Declined",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        statusStyles[status],
        className
      )}
    >
      {label || statusLabels[status]}
    </Badge>
  );
}
