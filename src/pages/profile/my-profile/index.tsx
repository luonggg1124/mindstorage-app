import { useMemo, useState } from "react";

import { currentUserProfile } from "../data";
import { useAuth } from "@/data/api/auth";
import { useMyProfile } from "@/data/api/user";
import { useMyActivities } from "@/data/api/statistics";
import ActivityChartCard from "./components/activity-chart-card";
import ContributionChartCard from "./components/contribution-chart-card";

const MyProfilePage = () => {
  const profile = currentUserProfile;
  const { user } = useAuth();
  const { data: myProfile, loading } = useMyProfile();
  const [range, setRange] = useState<7 | 30>(7);
  const activities = useMyActivities(range);

  const notesData = useMemo(() => activities.data?.notesData ?? [], [activities.data?.notesData]);
  const topicsData = useMemo(() => activities.data?.topicsData, [activities.data?.topicsData]);

  const displayName =
    (myProfile?.fullName ?? "").trim() ||
    (user?.fullName ?? "").trim() ||
    myProfile?.username ||
    user?.username ||
    profile.name;
  const handle = user?.username ? `@${user.username}` : `@${profile.id}`;
  const email = myProfile?.email || user?.email || profile.email;
  const verifiedLabel = user ? (user.verified ? "Verified" : "Unverified") : "Sample";

  const hobbyChips =
    (myProfile?.hobbies ?? user?.hobbies ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8) ?? [];
  const chips = hobbyChips.length > 0 ? hobbyChips : profile.skills;
  const bioText = (myProfile?.hobbies ?? user?.hobbies ?? "").trim() || profile.bio;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-8 w-64 max-w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-72 max-w-full animate-pulse rounded bg-white/10" />
              </div>
            </div>
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        ) : (
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

          
        </div>
        )}
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
              <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-9 w-20 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-36 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <p className="text-xs text-slate-300/70">Không gian</p>
            <p className="mt-2 text-3xl font-semibold text-slate-100">{myProfile?.spacesCount ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-300/70">Tổng </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            <p className="text-xs text-slate-300/70">Không gian đã tham gia</p>
            <p className="mt-2 text-3xl font-semibold text-slate-100">{myProfile?.spaceMembersCount ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-300/70">Số không gian bạn đang tham gia</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <ActivityChartCard
            range={range}
            loading={activities.loading}
            errorMessage={activities.error?.message}
            notesData={notesData}
            onToggleRange={() => setRange((prev) => (prev === 7 ? 30 : 7))}
          />
        </div>

        <aside className="space-y-6">
          <ContributionChartCard
            loading={activities.loading}
            errorMessage={activities.error?.message}
            topicsData={topicsData}
          />
        </aside>
      </div>
    </section>
  );
};

export default MyProfilePage;
