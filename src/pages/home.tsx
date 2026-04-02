import { Link } from "react-router";
import clientPaths from "@/paths/client";

export default function Home() {
  return (
    <section className="space-y-4 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang chủ</h1>
        <p className="text-muted-foreground">
          Sidebar hiện có mục `Spaces`, vào từng `space` sẽ thấy các `group`, rồi mở tiếp để xem note.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">Bắt đầu nhanh</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Mở trang spaces để duyệt danh sách space, chọn một space để xem group, rồi vào group để xem note chi tiết.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to={clientPaths.space.list.getPath()}
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Mở spaces
          </Link>

          <Link
            to={clientPaths.auth.login.getPath()}
            className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Đến trang đăng nhập
          </Link>
        </div>
      </div>
    </section>
  );
}