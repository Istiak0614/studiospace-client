import type { Booking } from "@/types/booking";
import { formatBookingDate, formatTimeRange } from "./format";

const plain = (text: string) => text.replace(/–/g, "-").replace(/×/g, "x");
const money = (n: number) => `$${n.toFixed(2)}`;

export async function downloadInvoice(booking: Booking) {
  const { jsPDF } = await import("jspdf"); // loaded only when someone clicks "Invoice"
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const M = 48; 
  const invoiceNo = `SS-${booking._id.slice(-8).toUpperCase()}`;
  const issued = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const subtotal = booking.hours * booking.hourlyRate;

  doc.setFillColor(20, 18, 38);
  doc.rect(0, 0, W, 120, "F");
  doc.setFillColor(245, 166, 35);
  doc.rect(0, 120, W, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(26).text("StudioSpace", M, 62);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(200, 200, 215);
  doc.text("Creative spaces, booked by the hour", M, 82);

  doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(20);
  doc.text("INVOICE", W - M, 58, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`No. ${invoiceNo}`, W - M, 78, { align: "right" });
  doc.text(`Issued ${issued}`, W - M, 94, { align: "right" });

  const label = (text: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(140, 140, 160);
    doc.text(text, x, y);
  };
  const value = (lines: string[], x: number, y: number) => {
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(30, 30, 45);
    lines.forEach((line, i) => doc.text(plain(line), x, y + i * 16));
  };

  let y = 172;
  label("BILLED TO", M, y);
  value([booking.guestName, booking.guestEmail], M, y + 18);
  label("HOST", W / 2, y);
  value([booking.hostName, booking.hostEmail], W / 2, y + 18);

  y = 240;
  doc.setDrawColor(230, 228, 240).setFillColor(248, 247, 252);
  doc.roundedRect(M, y, W - M * 2, 78, 8, 8, "FD");
  label("STUDIO", M + 16, y + 22);
  value([booking.studioTitle, booking.studioLocation], M + 16, y + 40);
  label("SESSION", W / 2, y + 22);
  value([formatBookingDate(booking.startTime), `${formatTimeRange(booking.startTime, booking.endTime)} (${booking.hours} h)`], W / 2, y + 40);
  label("STATUS", W - M - 80, y + 22);
  value([booking.status], W - M - 80, y + 40);

  y = 360;
  const cols = { desc: M, qty: W - M - 220, rate: W - M - 130, amount: W - M };
  doc.setFillColor(20, 18, 38).rect(M, y - 16, W - M * 2, 26, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(255, 255, 255);
  doc.text("DESCRIPTION", cols.desc + 12, y);
  doc.text("QTY", cols.qty, y);
  doc.text("RATE", cols.rate, y);
  doc.text("AMOUNT", cols.amount - 12, y, { align: "right" });

  const rows = [
    [`Studio hire - ${booking.studioTitle}`, `${booking.hours} h`, money(booking.hourlyRate), money(subtotal)],
    ["Security deposit (refundable)", "1", money(booking.securityDeposit), money(booking.securityDeposit)],
  ];
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(30, 30, 45);
  rows.forEach(([desc, qty, rate, amount], i) => {
    const rowY = y + 32 + i * 30;
    doc.text(plain(desc), cols.desc + 12, rowY, { maxWidth: cols.qty - cols.desc - 24 });
    doc.text(qty, cols.qty, rowY);
    doc.text(rate, cols.rate, rowY);
    doc.text(amount, cols.amount - 12, rowY, { align: "right" });
    doc.setDrawColor(235, 233, 243).line(M, rowY + 12, W - M, rowY + 12);
  });

  y = y + 32 + rows.length * 30 + 12;
  doc.setFillColor(245, 166, 35).roundedRect(W - M - 220, y, 220, 44, 8, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(20, 18, 38);
  doc.text("TOTAL", W - M - 204, y + 27);
  doc.setFontSize(16).text(money(booking.totalPrice), W - M - 16, y + 28, { align: "right" });

  const footY = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor(230, 228, 240).line(M, footY - 16, W - M, footY - 16);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(140, 140, 160);
  doc.text("The security deposit is refunded after the session if the space and equipment are undamaged.", M, footY);
  doc.text("Thank you for creating with StudioSpace.", M, footY + 14);

  doc.save(`StudioSpace-invoice-${invoiceNo}.pdf`);
}