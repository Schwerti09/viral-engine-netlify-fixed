"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Row = { date: string; views: number; likes: number; comments: number; shares: number; followers: number };

export default function AnalyticsChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickMargin={8} />
          <YAxis tickMargin={8} />
          <Tooltip />
          <Line type="monotone" dataKey="views" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="likes" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-muted-foreground">
        Tipp: Für Retention-Kurven: als AreaChart + percent-scale modellieren (0..100) und Segment-Events annotieren.
      </p>
    </div>
  );
}
