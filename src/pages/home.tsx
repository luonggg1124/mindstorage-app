import { Link } from "react-router";
import clientPaths from "@/paths/client";
import { useWeather } from "@/data/api/utils";


export default function Home() {
  const weather = useWeather();
  const weatherIcon = weather.data?.weather?.conditionIcon
    ? weather.data.weather.conditionIcon.startsWith("//")
      ? `https:${weather.data.weather.conditionIcon}`
      : weather.data.weather.conditionIcon
    : null;

  
  const stats = [
    { label: "Spaces", value: 3, hint: "+1 tuần này" },
    { label: "Groups", value: 12, hint: "đang hoạt động" },
    { label: "Notes", value: 48, hint: "đã tạo" },
  ] as const;

  const recentSpaces = [
    { id: "1", name: "UTC - Java 1", description: "Bài tập + ghi chú môn học", updatedAt: "2 giờ trước" },
    { id: "2", name: "Side project", description: "Ý tưởng app + backlog", updatedAt: "Hôm qua" },
    { id: "3", name: "Personal", description: "Việc cá nhân, thói quen", updatedAt: "3 ngày trước" },
  ] as const;

  const recentGroups = [
    { id: "101", name: "Tuần 1", spaceName: "UTC - Java 1" },
    { id: "102", name: "Tuần 2", spaceName: "UTC - Java 1" },
    { id: "201", name: "UI ideas", spaceName: "Side project" },
  ] as const;

  const recentNotes = [
    { title: "Ôn OOP: class/interface", groupName: "Tuần 2", updatedAt: "10 phút trước" },
    { title: "Các lỗi thường gặp khi dùng React Query", groupName: "UI ideas", updatedAt: "1 giờ trước" },
    { title: "Plan: CRUD Space/Group/Note", groupName: "Tuần 1", updatedAt: "Hôm qua" },
  ] as const;

  return (
    <section className="space-y-6">
      

      {/* Widgets row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {weather.loading ? (
          <div className="relative  overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur animate-pulse">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="relative  overflow-hidden rounded-2xl border  p-4 shadow-sm backdrop-blur">
          
          

          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-medium leading-none">Thời tiết</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
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

          <div className="flex h-[calc(100%-2.75rem)] flex-col justify-between">
            {!weather.supported ? (
              <div className="text-sm text-muted-foreground">Thiết bị không hỗ trợ định vị.</div>
            ) : weather.error ? (
              <div className="text-sm text-red-500">
                {weather.error instanceof Error ? weather.error.message : String(weather.error)}
              </div>
            ) : !weather.data ? (
              <div className="text-sm text-white/80">Chưa có dữ liệu.</div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-4xl font-semibold tracking-tight">
                      {Math.round(weather.data.weather.tempC)}°
                    </div>
                    {weatherIcon ? (
                      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-border/50 bg-transparent shadow-sm backdrop-blur-sm">
                        <img
                          src={weatherIcon}
                          alt={weather.data.weather.conditionText}
                          className="h-10 w-10"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-2 inline-flex items-center rounded-full border border-border/50 bg-transparent px-2 py-1 text-xs text-white backdrop-blur-sm">
                    {weather.data.weather.conditionText}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <div className="rounded-full border border-border/50 bg-transparent px-2 py-1 text-muted-foreground backdrop-blur-sm">
                    Cảm giác{" "}
                    <span className="font-medium text-white">
                      {Math.round(weather.data.weather.feelslikeC)}°
                    </span>
                  </div>
                  <div className="rounded-full border border-border/50 bg-transparent px-2 py-1 text-muted-foreground backdrop-blur-sm">
                    Ẩm <span className="font-medium text-white">{weather.data.weather.humidity}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        )}

        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/50 bg-transparent p-4 shadow-sm backdrop-blur-md">
            <div className="text-sm font-medium">{s.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent spaces */}
        <div className="rounded-2xl border border-border/50 bg-transparent p-6 shadow-sm backdrop-blur-md lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">Spaces gần đây</div>
              <div className="text-sm text-muted-foreground">Tiếp tục nơi bạn đang làm việc.</div>
            </div>
            <Link to={clientPaths.space.list.getPath()} className="text-sm font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {recentSpaces.map((sp) => (
              <Link
                key={sp.id}
                to={clientPaths.space.detail.getPath(sp.id)}
                className="group rounded-xl border border-border/50 bg-transparent p-4 backdrop-blur-sm transition hover:border-border hover:bg-foreground/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold group-hover:underline">{sp.name}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{sp.description}</div>
                  </div>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border/50 bg-transparent text-xs font-semibold backdrop-blur-sm">
                    SP
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">Cập nhật: {sp.updatedAt}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/50 bg-transparent p-6 shadow-sm backdrop-blur-md">
            <div className="mb-3 text-lg font-semibold">Groups gần đây</div>
            <div className="space-y-2">
              {recentGroups.map((g) => (
                <Link
                  key={g.id}
                  to={clientPaths.group.detail.getPath(g.id)}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-transparent px-3 py-2 backdrop-blur-sm transition hover:border-border hover:bg-foreground/5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{g.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{g.spaceName}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Mở</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-transparent p-6 shadow-sm backdrop-blur-md">
            <div className="mb-3 text-lg font-semibold">Notes gần đây</div>
            <div className="space-y-3">
              {recentNotes.map((n) => (
                <div key={n.title} className="rounded-xl border border-border/50 bg-transparent p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{n.groupName}</span>
                    <span>{n.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Gợi ý: vào <span className="font-medium text-foreground">Space</span> → chọn{" "}
              <span className="font-medium text-foreground">Group</span> để xem note chi tiết.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}