"use client"

import { AreaChart, CartesianGrid, XAxis, YAxis, Area, ReferenceLine } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { type ChartInterval } from "../employee-assignments.types"
import { prepareStackedData } from "../employee-assignments.utils"

interface WorkloadChartProps {
  currentWorkload: ChartInterval[]
  requestedWorkload: ChartInterval[]
}

const chartConfig = {
  current: {
    label: "Aktualne obciążenie",
    color: "#93c5fd",
  },
  requested: {
    label: "Wnioskowane obciążenie",
    color: "#fb923c",
  },
} satisfies ChartConfig

export const EmployeeWorkloadChart = ({ currentWorkload, requestedWorkload }: WorkloadChartProps) => {
  const chartData = prepareStackedData(currentWorkload, requestedWorkload);

  return (
    <div className="w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <pattern
              id="hatch"
              patternUnits="userSpaceOnUse"
              width="7"
              height="7"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke="var(--color-requested)"
                strokeWidth="4"
              />
            </pattern>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("pl-PL", { month: "short", day: "numeric" })
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            unit="%"
            domain={[0, 120]}
            ticks={[0, 25, 50, 75, 100]}
          />

          <ReferenceLine
            y={100}
            stroke="red"
            strokeDasharray="3 2"
            strokeWidth={0.5}
            label={{
              value: "Limit 100%",
              position: "top",
              fill: "red",
              fontSize: 11
            }}
          />

          <Area
            stackId="workload"
            type="stepAfter"
            dataKey="current"
            stroke="var(--color-current)"
            fill="var(--color-current)"
            fillOpacity={0.5}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            connectNulls
          />

          <Area
            stackId="workload"
            type="stepAfter"
            dataKey="requested"
            stroke="var(--color-requested)"
            fill="url(#hatch)"
            fillOpacity={0.5}
            strokeWidth={2}
            strokeDasharray="8 6"
            dot={false}
            activeDot={false}
            connectNulls
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}