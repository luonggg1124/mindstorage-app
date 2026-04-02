import { Link } from "react-router";

import { currentUserProfile, otherProfiles } from "../data";
import clientPaths from "@/paths/client";

const MyProfilePage = () => {
  const profile = currentUserProfile;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">My profile</p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-muted-foreground">
                {profile.role} · {profile.major}
              </p>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{profile.bio}</p>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/profile/${profile.id}`}
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Xem public profile
            </Link>
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Đi đến spaces
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Tổng quan cá nhân</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Bài viết</p>
              <p className="text-2xl font-semibold">{profile.stats.posts}</p>
            </div>
            <div className="rounded-xl bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Followers</p>
              <p className="text-2xl font-semibold">{profile.stats.followers}</p>
            </div>
            <div className="rounded-xl bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Nhóm tham gia</p>
              <p className="text-2xl font-semibold">{profile.stats.groups}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {profile.highlights.map((item) => (
              <li key={item} className="rounded-xl bg-muted/50 px-4 py-3 leading-6">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Khám phá thành viên khác</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chọn một bạn khác để mở trang `profile/:id`.
          </p>

          <div className="mt-4 space-y-3">
            {otherProfiles.map((item) => (
              <article key={item.id} className="rounded-xl border p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
                <Link
                  to={`/profile/${item.id}`}
                  className="mt-3 inline-flex rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
                >
                  Xem hồ sơ
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default MyProfilePage;
