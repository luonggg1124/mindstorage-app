import { Link } from "react-router";

import { currentUserProfile, otherProfiles } from "../data";
import clientPaths from "@/paths/client";
import Chart from "@/components/custom/chart";
import type { ApexOptions } from "apexcharts";
import { useAuth } from "@/data/api/auth";

const MyProfilePage = () => {
  const profile = currentUserProfile;
  const { user } = useAuth();

  const displayName = (user?.fullName ?? "").trim() || user?.username || profile.name;
  const handle = user?.username ? `@${user.username}` : `@${profile.id}`;
  const email = user?.email || profile.email;
  const verifiedLabel = user ? (user.verified ? "Verified" : "Unverified") : "Sample";

  const hobbyChips =
    (user?.hobbies ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8) ?? [];
  const chips = hobbyChips.length > 0 ? hobbyChips : profile.skills;
  const bioText = (user?.hobbies ?? "").trim() || profile.bio;

  // Fake data (tạm thời) — thay bằng API thật sau
  const activitySeries = [
    {
      name: "Notes",
      data: [2, 1, 4, 3, 6, 4, 5],
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
      categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      labels: { style: { colors: "rgba(226,232,240,0.7)" } },
      axisBorder: { color: "rgba(255,255,255,0.10)" },
      axisTicks: { color: "rgba(255,255,255,0.10)" },
    },
    yaxis: {
      labels: { style: { colors: "rgba(226,232,240,0.7)" } },
    },
    tooltip: { theme: "dark" },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.6, opacityFrom: 0.35, opacityTo: 0.05 },
    },
    colors: ["#60a5fa"],
  };

  const contributionSeries = [44, 28, 18, 10];
  const contributionLabels = ["Notes", "Topics", "Groups", "Spaces"];
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
              formatter: () => "100%",
            },
          },
        },
      },
    },
    tooltip: { theme: "dark" },
    colors: ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24"],
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-lg font-semibold text-slate-100">
                    {(displayName?.trim()?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-300/70">Hồ sơ của tôi</p>
                <h1 className="mt-1 truncate text-3xl font-bold tracking-tight text-slate-100">{displayName}</h1>
                <p className="mt-1 text-sm text-slate-300/80">
                  <span className="text-slate-200">{handle}</span> ·{" "}
                  <span className="text-slate-200">{email}</span> ·{" "}
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">
                    {verifiedLabel}
                  </span>
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-300/80">{bioText}</p>

            <div className="flex flex-wrap gap-2">
              {chips.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={clientPaths.profile.detail.getPath(profile.id)}
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Xem public profile
            </Link>
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Đi đến spaces
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Bài viết</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.posts}</p>
          <p className="mt-1 text-xs text-slate-300/70">Tổng bài/ghi chú đã tạo</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Followers</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.followers}</p>
          <p className="mt-1 text-xs text-slate-300/70">Lượt theo dõi</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Nhóm tham gia</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.groups}</p>
          <p className="mt-1 text-xs text-slate-300/70">Số group bạn đang hoạt động</p>
        </div>
      </div>

      {/* Charts + highlights */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Hoạt động 7 ngày</h2>
                <p className="mt-1 text-sm text-slate-300/70">Số note tạo (fake data)</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Tuần này
              </div>
            </div>

            <div className="mt-4">
              <Chart
                options={{
                  ...activityOptions,
                  series: activitySeries
                }}
                height={260}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Điểm nhấn</h2>
                <p className="mt-1 text-sm text-slate-300/70">Các việc gần đây bạn đã làm</p>
              </div>
              <div className="text-xs text-slate-300/70">{profile.email}</div>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-slate-200/90">
              {profile.highlights.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-6">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Phân bổ đóng góp</h2>
            <p className="mt-1 text-sm text-slate-300/70">Fake data, minh hoạ dashboard</p>

            <div className="mt-4">
              <Chart
                options={{
                  ...contributionOptions,
                  series: contributionSeries
                }}
                height={280}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Khám phá thành viên khác</h2>
            <p className="mt-2 text-sm text-slate-300/70">Mở nhanh public profile (fake data).</p>

            <div className="mt-4 space-y-3">
              {otherProfiles.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-slate-100">{item.name}</p>
                  <p className="text-sm text-slate-300/70">{item.role}</p>
                  <Link
                    to={clientPaths.profile.detail.getPath(item.id)}
                    className="mt-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Xem hồ sơ
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default MyProfilePage;
