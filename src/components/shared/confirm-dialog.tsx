"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { errorMessage } from "@/lib/api";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>; 
  destructive?: boolean;
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel, onConfirm, destructive = true,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <DialogContent className="glass-strong rounded-3xl p-8 sm:max-w-md">
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <span className={`mb-2 grid size-14 place-items-center rounded-2xl ${destructive ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
            <AlertTriangle className="size-7" />
          </span>
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1 rounded-full" disabled={loading} onClick={() => onOpenChange(false)}>
            Keep it
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="flex-1 rounded-full"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}