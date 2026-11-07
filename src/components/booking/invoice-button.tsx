"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadInvoice } from "@/lib/invoice";
import type { Booking } from "@/types/booking";

export function InvoiceButton({ booking }: { booking: Booking }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      await downloadInvoice(booking);
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Couldn't create the invoice. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleClick} disabled={busy} className="rounded-full">
      {busy ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
      Invoice
    </Button>
  );
}