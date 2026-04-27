import { buildQueryString } from "@/utils/path";

const notificationPaths = {
  myNotifications: {
    path: "/api/notification/my-notifications",
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/api/notification/my-notifications${buildQueryString(queries)}`,
  },
  unreadCount: {
    path: "/api/notification/unread-count",
  },
};

export default notificationPaths;

