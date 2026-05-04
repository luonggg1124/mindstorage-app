import type { IInviteNotificationData, IRoleChangeNotificationData } from "@/data/models/notification";
import { normalizeNotificationType, NotificationType } from "@/data/models/notification";

type Row =
  | { type: NotificationType.INVITE; data: IInviteNotificationData | null }
  | { type: NotificationType.ROLE_CHANGED; data: IRoleChangeNotificationData | null };

type NotificationBodyProps = {
  row: Row;
  /** Khi item đã đọc trong sidebar — giảm độ nổi bật */
  dimmed?: boolean;
};

function inviteEntityLabel(invite: IInviteNotificationData | null) {
  const t = (invite?.entityType ?? "").toUpperCase();
  if (t.includes("GROUP")) return "nhóm";
  if (t.includes("SPACE")) return "không gian";
  return "không gian";
}

export default function NotificationBody({ row, dimmed }: NotificationBodyProps) {
  const kind = normalizeNotificationType(row.type, row.data);
  const hl = dimmed ? "font-semibold text-indigo-400/75" : "font-semibold text-indigo-300";
  const titleClass = dimmed
    ? "truncate text-sm font-semibold text-slate-200/80"
    : "truncate text-sm font-semibold text-slate-100";
  const bodyClass = dimmed
    ? "mt-1 line-clamp-4 text-xs text-slate-300/55"
    : "mt-1 line-clamp-4 text-xs text-slate-300/75";

  if (kind === NotificationType.INVITE) {
    const invite = row.data as IInviteNotificationData | null;
    const where = inviteEntityLabel(invite);
    const status = (invite?.invitationStatus ?? "").trim().toUpperCase();
    const actor = invite?.senderName ? <span className={hl}>{invite.senderName}</span> : <span>Một thành viên</span>;
    const entityNode = invite?.entityName ? (
      <span className={hl}>{invite.entityName}</span>
    ) : invite?.entityId ? (
      <span className={hl}>{invite.entityId}</span>
    ) : (
      <span>…</span>
    );

    if (status === "ACCEPTED") {
      return (
        <>
          <p className={titleClass}>Lời mời đã được chấp nhận</p>
          <p className={bodyClass}>
            {actor}
            <span> đã chấp nhận lời mời vào {where} </span>
            {entityNode}
          </p>
        </>
      );
    }

    if (status === "REJECTED") {
      return (
        <>
          <p className={titleClass}>Lời mời đã bị từ chối</p>
          <p className={bodyClass}>
            {actor}
            <span> đã từ chối lời mời vào {where} </span>
            {entityNode}
          </p>
        </>
      );
    }

    return (
      <>
        <p className={titleClass}>Lời mời tham gia {where}</p>
        <p className={bodyClass}>
          {actor}
          <span> mời bạn tham gia {where} </span>
          {entityNode}
        </p>
      </>
    );
  }

  if (kind === NotificationType.ROLE_CHANGED) {
    const role = row.data as IRoleChangeNotificationData | null;
    return (
      <>
        <p className={titleClass}>Thay đổi vai trò</p>
        <p className={bodyClass}>
          {role?.changedByName ? (
            <>
              <span className={hl}>{role.changedByName}</span>
              <span> đã cập nhật vai trò </span>
            </>
          ) : (
            <span>Vai trò đã được cập nhật </span>
          )}
          {role?.targetUserName ? (
            <>
              <span>của </span>
              <span className={hl}>{role.targetUserName}</span>
            </>
          ) : null}
          {role?.entityName ? (
            <>
              <span> tại </span>
              <span className={hl}>{role.entityName}</span>
            </>
          ) : role?.entityId ? (
            <>
              <span> · </span>
              <span className={hl}>{role.entityId}</span>
            </>
          ) : null}
          {role?.oldRole != null && role.oldRole !== "" && role?.newRole != null && role.newRole !== "" ? (
            <>
              <span>: </span>
              <span className={hl}>{role.oldRole}</span>
              <span> → </span>
              <span className={hl}>{role.newRole}</span>
            </>
          ) : role?.newRole ? (
            <>
              <span> → </span>
              <span className={hl}>{role.newRole}</span>
            </>
          ) : null}
        </p>
      </>
    );
  }

  return (
    <>
      <p className={titleClass}>Thông báo</p>
      <p className={bodyClass}>Bạn có một thông báo mới.</p>
    </>
  );
}
