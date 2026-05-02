import { Link } from "react-router";
import clientPaths from "@/paths/client";
import { useWeather } from "@/data/api/utils";
import { useSuggestions } from "@/data/api/suggestions";
import { formatRelative } from "@/utils/date";

export default function Home() {
  const weather = useWeather();
  const suggestions = useSuggestions(5);
  const weatherIcon = weather.data?.weather?.conditionIcon
    ? weather.data.weather.conditionIcon.startsWith("//")
      ? `https:${weather.data.weather.conditionIcon}`
      : weather.data.weather.conditionIcon
    : null;

  const friendShares = [
    {
      id: "p1",
      author: { name: "Trần Minh Khoa", handle: "@tran-minh-khoa" },
      time: "8 phút trước",
      title: "Checklist React Query cho team",
      content:
        "Mình tổng hợp vài rule khi dùng TanStack Query để tránh gọi API trùng và cache sai. Ai cần mình share file markdown nhé.",
      tags: ["react-query", "frontend", "notes"],
      target: { kind: "space" as const, id: "1", label: "UTC - Java 1" },
    },
    {
      id: "p2",
      author: { name: "Lê Thảo Uyên", handle: "@le-thao-uyen" },
      time: "1 giờ trước",
      title: "Template mô tả Group",
      content:
        "Mình vừa tạo template mô tả group theo format: mục tiêu, tài liệu, phân công. Dùng được cho mọi tuần.",
      tags: ["template", "teamwork"],
      target: { kind: "group" as const, id: "102", label: "Tuần 2" },
    },
    {
      id: "p3",
      author: { name: "Nguyễn Hoàng", handle: "@nguyen-hoang" },
      time: "Hôm qua",
      title: "Idea: phân quyền OWNER/EDITOR/VIEWER",
      content:
        "Nếu cần phân quyền rõ hơn, mình nghĩ nên hiển thị role badge ở member list và giới hạn action theo role.",
      tags: ["role", "space"],
      target: { kind: "space" as const, id: "2", label: "Side project" },
    },
  ] as const;

  return (
    <section className="space-y-6">
      <div className="grid h-[calc(100vh-8rem)] min-h-0 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main feed */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-100">Trang chủ</h1>
                <p className="mt-1 text-sm text-slate-300/70">Xem những chia sẻ mới nhất từ bạn bè (fake data).</p>
              </div>
              <Link
                to={clientPaths.space.list.getPath()}
                className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Mở Spaces
              </Link>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-3">
              {friendShares.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:bg-white/[0.07]"
                >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100">
                      {(post.author.name.trim()[0] ?? "U").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate text-sm font-semibold text-slate-100">{post.author.name}</p>
                        <p className="truncate text-xs text-slate-300/70">{post.author.handle}</p>
                        <span className="text-xs text-slate-300/50">•</span>
                        <p className="text-xs text-slate-300/70">{post.time}</p>
                      </div>
                      <div className="mt-1">
                        {post.target.kind === "space" ? (
                          <Link
                            to={clientPaths.space.detail.getPath(post.target.id)}
                            className="text-xs font-medium text-indigo-200/90 hover:underline"
                          >
                            Space: {post.target.label}
                          </Link>
                        ) : (
                          <Link
                            to={clientPaths.group.detail.getPath(post.target.id)}
                            className="text-xs font-medium text-indigo-200/90 hover:underline"
                          >
                            Group: {post.target.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h2 className="text-base font-semibold text-slate-100">{post.title}</h2>
                  <p className="text-sm leading-6 text-slate-300/80">{post.content}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Thích
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Bình luận
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Lưu
                  </button>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="flex min-h-0 flex-col gap-4">
          {/* Weather widget */}
          {weather.loading ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur animate-pulse">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-none text-slate-100">Thời tiết</div>
                  <div className="mt-1 truncate text-xs text-slate-300/70">
                    {weather.data?.location ? (
                      <>
                        {weather.data.location.locality}, {weather.data.location.city}
                      </>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void weather.refetch()}
                    disabled={weather.loading}
                    className="rounded-full border border-white/15 bg-transparent px-2 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/5 disabled:opacity-50"
                    title="Làm mới thời tiết"
                  >
                    Làm mới
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3">
                {!weather.supported ? (
                  <div className="text-sm text-slate-300/70">Thiết bị không hỗ trợ định vị.</div>
                ) : weather.error ? (
                  <div className="text-sm text-red-300">
                    {weather.error instanceof Error ? weather.error.message : String(weather.error)}
                  </div>
                ) : !weather.data ? (
                  <div className="text-sm text-white/80">Chưa có dữ liệu.</div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-4xl font-semibold tracking-tight text-slate-100">
                          {Math.round(weather.data.weather.tempC)}°
                        </div>
                        {weatherIcon ? (
                          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm">
                            <img
                              src={weatherIcon}
                              alt={weather.data.weather.conditionText}
                              className="h-10 w-10"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100 backdrop-blur-sm">
                        {weather.data.weather.conditionText}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-300/70 backdrop-blur-sm">
                        Cảm giác{" "}
                        <span className="font-medium text-slate-100">
                          {Math.round(weather.data.weather.feelslikeC)}°
                        </span>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-300/70 backdrop-blur-sm">
                        Ẩm <span className="font-medium text-slate-100">{weather.data.weather.humidity}%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* History / suggestions */}
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Gợi ý </h2>
               
              </div>
              <Link
                to={clientPaths.space.list.getPath()}
                className="text-xs font-semibold text-slate-200 transition hover:underline"
              >
                Xem
              </Link>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="space-y-2">
                {suggestions.loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[52px] animate-pulse rounded-xl border border-white/10 bg-white/5"
                    />
                  ))
                ) : suggestions.error ? (
                  <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {suggestions.error.message || "Lỗi khi tải gợi ý."}
                  </div>
                ) : (suggestions.data?.length ?? 0) > 0 ? (
                  suggestions.data!.map((item) => {
                    const href =
                      item.type === "SPACE"
                        ? clientPaths.space.detail.getPath(item.id)
                        : clientPaths.group.detail.getPath(item.id);
                    const badge = item.type === "SPACE" ? "SP" : "GR";
                    return (
                      <Link
                        key={`${item.type}-${item.id}`}
                        to={href}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-[11px] font-bold text-slate-100">
                            {badge}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-100">{item.name}</p>
                            <p className="truncate text-xs text-slate-300/70">
                              {item.type === "SPACE" ? "Space" : "Group"}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] text-slate-300/60">
                          {formatRelative(item.lastActivityAt, "—")}
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/80">
                    Chưa có gợi ý.
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}