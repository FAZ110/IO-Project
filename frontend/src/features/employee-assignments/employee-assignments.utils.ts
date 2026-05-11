import type { ChartInterval } from "./employee-assignments.types";

export const prepareStackedData = (current: ChartInterval[], requested: ChartInterval[]) => {
  // NIE WIEM JAK TO DZIALA ALE DZIALA WIEC NIE RUSZAM
  // DO ZMIANY KIEDYS
  const dates = [...new Set([...current, ...requested].flatMap(i => [i.startDate, i.endDate]))].sort();

  return dates.map(date => ({
    date,
    current: current.find(i => i.startDate <= date && date < i.endDate)?.percentage || 0,
    requested: requested.find(i => i.startDate <= date && date < i.endDate)?.percentage || 0,
  }));
};