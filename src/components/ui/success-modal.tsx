import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "OK",
}: SuccessModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-center text-base">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button onClick={handleConfirm} className="min-w-32">
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
