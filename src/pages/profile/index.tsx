import { Link, useParams } from "react-router";

import { findProfileById } from "./data";
import clientPaths from "@/paths/client";
import Chart from "@/components/custom/chart";
import type { ApexOptions } from "apexcharts";

const ProfilePage = () => {
  const { id } = useParams();
  const profile = findProfileById(id);

  if (!profile) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-bold text-slate-100">Không tìm thấy hồ sơ</h1>
          <p className="mt-2 text-sm text-slate-300/80">
            Người dùng bạn đang tìm không tồn tại hoặc chưa được thêm vào dữ liệu mẫu.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/my-profile"
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Quay lại hồ sơ của tôi
            </Link>
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Đi đến spaces
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activitySeries = [
    {
      name: "Hoạt động",
      data: [1, 3, 2, 4, 3, 5, 4],
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
    colors: ["#a78bfa"],
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="grid h-full w-full place-items-center text-lg font-semibold text-slate-100">
                  {(profile.name?.trim()?.[0] ?? "U").toUpperCase()}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-300/70">Public profile</p>
                <h1 className="mt-1 truncate text-3xl font-bold tracking-tight text-slate-100">{profile.name}</h1>
                <p className="mt-1 text-sm text-slate-300/80">
                  {profile.role} · {profile.major} · <span className="text-slate-200">{profile.location}</span>
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-300/80">{profile.bio}</p>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
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
            <button
              type="button"
              className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Theo dõi
            </button>
            <Link
              to="/my-profile"
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Hồ sơ của tôi
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Bài viết</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.posts}</p>
          <p className="mt-1 text-xs text-slate-300/70">Tổng bài/ghi chú</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Followers</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.followers}</p>
          <p className="mt-1 text-xs text-slate-300/70">Lượt theo dõi</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-300/70">Nhóm tham gia</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{profile.stats.groups}</p>
          <p className="mt-1 text-xs text-slate-300/70">Số group hoạt động</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Hoạt động 7 ngày</h2>
                <p className="mt-1 text-sm text-slate-300/70">Biểu đồ minh hoạ (fake data)</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Tuần này
              </div>
            </div>

            <div className="mt-4">
              <Chart
                options={{
                  ...activityOptions,
                  series: activitySeries,
                }}
                height={260}
              />
            </div>
          </div>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Hoạt động nổi bật</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-200/90">
              {profile.highlights.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 leading-6">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-100">Thông tin liên hệ</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-slate-300/70">Email</dt>
              <dd className="font-medium text-slate-100">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-slate-300/70">Địa điểm</dt>
              <dd className="font-medium text-slate-100">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-slate-300/70">Profile ID</dt>
              <dd className="font-medium text-slate-100">{profile.id}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Xem spaces
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ProfilePage;
