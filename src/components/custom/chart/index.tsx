"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ApexOptions } from "apexcharts";
import { cn } from "@/lib/utils";

export type ApexChartOptions = ApexOptions;

interface ApexChartProps {
  options: ApexChartOptions;
  className?: string;
  height?: number | string;
}

interface ApexChartInstance {
  render: () => Promise<unknown>;
  destroy: () => void;
}

const Chart = ({ options, className, height = 320 }: ApexChartProps): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexChartInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    import("apexcharts").then(({ default: ApexCharts }) => {
      if (!mounted || !containerRef.current) return;

      const chart = (new ApexCharts(containerRef.current, {
        ...options,
        chart: {
          ...(typeof options.chart === "object" && options.chart),
          fontFamily: "inherit",
        },
      }) as unknown) as ApexChartInstance;
      chartRef.current = chart;
      void chart.render();
    });

    return () => {
      mounted = false;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [options]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
    />
  );
};
export default Chart;