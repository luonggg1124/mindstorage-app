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
  readAll: {
    path: "/api/notification/read-all",
  },
  readOne: {
    path: "/api/notification/{id}/read",
    getPath: (id: string | number) => `/api/notification/${id}/read`,
  },
};

export default notificationPaths;

