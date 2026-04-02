import { Link, useParams } from "react-router";

import { findProfileById } from "./data";
import clientPaths from "@/paths/client";

const ProfilePage = () => {
  const { id } = useParams();
  const profile = findProfileById(id);

  if (!profile) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Không tìm thấy hồ sơ</h1>
        <p className="text-muted-foreground">
          Người dùng bạn đang tìm không tồn tại hoặc chưa được thêm vào dữ liệu mẫu.
        </p>
        <Link
          to="/my-profile"
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Quay lại hồ sơ của tôi
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Public profile</p>

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

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Hoạt động nổi bật</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {profile.highlights.map((item) => (
              <li key={item} className="rounded-xl bg-muted/50 px-4 py-3 leading-6">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Địa điểm</dt>
              <dd className="font-medium">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Profile ID</dt>
              <dd className="font-medium">{profile.id}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/my-profile"
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Hồ sơ của tôi
            </Link>
            <Link
              to={clientPaths.space.list.getPath()}
              className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
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
