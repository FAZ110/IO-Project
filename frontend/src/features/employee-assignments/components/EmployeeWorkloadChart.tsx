"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { type ChartInterval } from "../employee-assignments.types"

interface WorkloadChartProps {
  data: ChartInterval[]
}

const chartConfig = {
  percentage: {
    label: "Obciążenie",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export const EmployeeWorkloadChart = ({ data }: WorkloadChartProps) => {
  // 1. Sortujemy dane po dacie, żeby linia była ciągła
  const sortedData = [...data].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // 2. Mapujemy interwały na punkty. 
  // Używamy tylko startDate, bo type="stepAfter" sam dociągnie linię do następnego punktu.
  const chartData = sortedData.map(interval => ({
    date: interval.startDate,
    percentage: interval.percentage,
  }));

  return (
    <div className="w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => 
                new Date(value).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' })
              }
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              unit="%" 
              domain={[0, 120]} // 120, żeby widzieć ewentualne przeładowanie powyżej 100%
              ticks={[0, 25, 50, 75, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            
            {/* KLUCZ: type="stepAfter" tworzy linię skokową */}
            <Line
              type="stepAfter"
              dataKey="percentage"
              stroke="var(--color-percentage)"
              strokeWidth={3} // Grubsza linia lepiej wygląda jako "skokowa"
              dot={{ r: 4, fill: "var(--color-percentage)" }} // Kropki w miejscach zmian
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}