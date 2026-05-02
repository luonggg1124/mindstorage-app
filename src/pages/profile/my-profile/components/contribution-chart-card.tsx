import Chart from "@/components/custom/chart";
import type { ApexOptions } from "apexcharts";

type ContributionChartCardProps = {
  loading: boolean;
  errorMessage?: string;
  topicsData?: {
    total: number;
    items: Array<{ name: string; count: number; percentage: number }>;
  };
};

const ContributionChartCard = ({ loading, errorMessage, topicsData }: ContributionChartCardProps) => {
  const items = topicsData?.items ?? [];
  const contributionSeries = items.map((i) => i.count);
  const contributionLabels = items.map((i) => i.name);

  const contributionOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: contributionLabels,
    legend: {
      position: "bottom",
      labels: { colors: "rgba(226,232,240,0.8)" },
      fontSize: "12px",
      itemMargin: { horizontal: 10, vertical: 6 },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: true, color: "rgba(226,232,240,0.8)" },
            value: { show: true, color: "rgba(255,255,255,0.92)", fontSize: "22px", fontWeight: 700 },
            total: {
              show: true,
              label: "Tổng",
              color: "rgba(226,232,240,0.7)",
              formatter: () => String(topicsData?.total ?? 0),
            },
          },
        },
      },
    },
    tooltip: { theme: "dark" },
    colors: ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24"],
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-100">Phân bổ đóng góp</h2>
      <p className="mt-1 text-sm text-slate-300/70">Theo chủ đề (topics)</p>

      {loading ? (
        <div className="mt-4 h-[280px] animate-pulse rounded-xl bg-white/5" />
      ) : errorMessage ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : contributionSeries.length > 0 ? (
        <div className="mt-4">
          <Chart
            options={{
              ...contributionOptions,
              series: contributionSeries,
            }}
            height={280}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/80">
          Chưa có dữ liệu chủ đề.
        </div>
      )}
    </div>
  );
};

export default ContributionChartCard;

