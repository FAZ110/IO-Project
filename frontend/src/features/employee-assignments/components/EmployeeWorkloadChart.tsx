"use client"

import { AreaChart, CartesianGrid, XAxis, YAxis, Area, ReferenceLine, Legend } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { type ChartInterval } from "../employee-assignments.types"
import { prepareStackedData } from "../employee-assignments.utils"

interface WorkloadChartProps {
  currentWorkload: ChartInterval[]
  requestedWorkload: ChartInterval[]
  startDate?: Date
  endDate?: Date
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

export const EmployeeWorkloadChart = ({ currentWorkload, requestedWorkload, startDate, endDate }: WorkloadChartProps) => {
  const chartData = prepareStackedData(currentWorkload, requestedWorkload);
  const dates = chartData.map(d => d.date);

  const minDate = startDate ? startDate.getTime() : Math.min(...dates);
  const maxDate = endDate ? endDate.getTime() : Math.max(...dates);

  return (
    <div className="w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <pattern
              id="hatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="var(--color-requested)"
                strokeWidth="4"
              />
            </pattern>
          </defs>

          <Legend
            verticalAlign="top"
            align="right"
            content={(props) => {
              const { payload } = props;

              return (
                <ul className="flex justify-end gap-4 text-xs font-medium text-muted-foreground uppercase mb-4">
                  {payload?.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-2">
                      <svg width="14" height="14">
                        <rect
                          width="14"
                          height="14"
                          rx={2}
                          fill={entry.value === "requested" ? "url(#hatch)" : entry.color}
                          stroke={entry.color}
                        />
                      </svg>
                      <span>{entry.value === "current" ? "Obecne" : "Wnioskowane"}</span>
                    </li>
                  ))}
                </ul>
              );
            }}
          />

          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={[startDate?.getTime() ?? minDate, endDate?.getTime() ?? maxDate]}
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
            ticks={[0, 50, 100]}
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
            connectNulls={false}
            isAnimationActive={false}
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
            connectNulls={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}