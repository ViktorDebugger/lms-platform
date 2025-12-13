"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export const Chart = ({ data }: ChartProps) => {
  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
          margin={{ bottom: 100, top: 20, right: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" opacity={0.3} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "2px solid #9333ea",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(147, 51, 234, 0.2)",
            }}
          />
          <XAxis
            dataKey="name"
            stroke="#6b21a8"
            tickLine={false}
            axisLine={{ stroke: "#9333ea", strokeWidth: 2 }}
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => truncateText(value)}
          />
          <YAxis
            stroke="#6b21a8"
            tickLine={false}
            axisLine={{ stroke: "#9333ea", strokeWidth: 2 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="total"
            fill="#9333ea"
            barSize={30}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
