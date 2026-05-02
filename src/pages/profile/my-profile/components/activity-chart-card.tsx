import Chart from "@/components/custom/chart";
import type { ApexOptions } from "apexcharts";

type NotesDayRow = { date: string; label: string; noteCreated: number };

type ActivityChartCardProps = {
  range: 7 | 30;
  loading: boolean;
  errorMessage?: string;
  notesData?: NotesDayRow[];
  onToggleRange?: () => void;
};

/** Parse `YYYY-MM-DD` thành Date local (tránh lệch timezone). */
function parseIsoLocalDate(isoDate: string): Date | null {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

/** Nhãn trục X gọn: dd/MM */
function formatAxisDay(isoDate: string): string {
  const dt = parseIsoLocalDate(isoDate);
  if (!dt) return isoDate;
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(dt);
}

/** Tooltip: đầy đủ ngày (không dùng T2/T3...). */
function formatTooltipDay(isoDate: string): string {
  const dt = parseIsoLocalDate(isoDate);
  if (!dt) return isoDate;
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dt);
}

const ActivityChartCard = ({ range, loading, errorMessage, notesData, onToggleRange }: ActivityChartCardProps) => {
  const rows = notesData ?? [];
  const categories = rows.map((d) => formatAxisDay(d.date));
  const values = rows.map((d) => d.noteCreated);

  const activitySeries = [
    {
      name: "Ghi chú",
      data: values,
    },
  ];

  const activityOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2 },
    grid: { borderColor: "rgba(255,255,255,0.08)" },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { colors: "rgba(226,232,240,0.7)" } },
      axisBorder: { color: "rgba(255,255,255,0.10)" },
      axisTicks: { color: "rgba(255,255,255,0.10)" },
    },
    yaxis: {
      labels: { style: { colors: "rgba(226,232,240,0.7)" } },
    },
    tooltip: {
      theme: "dark",
      x: {
        formatter: (_category: string, opts?: { dataPointIndex?: number }) => {
          const i = opts?.dataPointIndex ?? 0;
          const date = rows[i]?.date;
          if (date) return formatTooltipDay(date);
          return rows[i]?.label ?? _category;
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.6, opacityFrom: 0.35, opacityTo: 0.05 },
    },
    colors: ["#60a5fa"],
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Hoạt động {range} ngày</h2>
          <p className="mt-1 text-sm text-slate-300/70">Số ghi chú tạo</p>
        </div>
        <button
          type="button"
          onClick={onToggleRange}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10"
        >
          {range === 7 ? "7 ngày" : "30 ngày"}
        </button>
      </div>

      {loading ? (
        <div className="mt-4 h-[260px] animate-pulse rounded-xl bg-white/5" />
      ) : errorMessage ? (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : (notesData?.length ?? 0) > 0 ? (
        <div className="mt-4">
          <Chart
            options={{
              ...activityOptions,
              series: activitySeries,
            }}
            height={260}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/80">
          Chưa có dữ liệu hoạt động.
        </div>
      )}
    </div>
  );
};

export default ActivityChartCard;

