"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";

type Point = { month: string; earnings: number };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function EarningsChart({ data }: { data: Point[] }) {
  return (
    <>
      <div className="relative">
        <div className="h-64" role="img" aria-label="Bar chart of earnings for the last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} width={56} allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(v: number) => formatCurrency(v)} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--border)" }} />
              <Bar dataKey="earnings" fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.every((d) => d.earnings === 0) && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="glass rounded-full px-4 py-2 text-sm text-muted-foreground">
              No earnings yet. Confirmed bookings at your studios appear here.
            </p>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Earnings by month</caption>
        <thead><tr><th>Month</th><th>Earnings</th></tr></thead>
        <tbody>
          {data.map((d) => <tr key={d.month}><td>{d.month}</td><td>{formatCurrency(d.earnings)}</td></tr>)}
        </tbody>
      </table>
    </>
  );
}
