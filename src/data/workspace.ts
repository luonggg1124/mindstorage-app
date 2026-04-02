export type WorkspaceChildNote = {
  id: string;
  title: string;
  summary: string;
  status: "To do" | "In progress" | "Done";
};

export type WorkspaceNote = {
  id: string;
  title: string;
  summary: string;
  content: string;
  updatedAt: string;
  color: string;
  children: WorkspaceChildNote[];
};

export type WorkspaceGroup = {
  id: string;
  spaceId: string;
  name: string;
  description: string;
  notes: WorkspaceNote[];
};

export type WorkspaceSpace = {
  id: string;
  name: string;
  description: string;
  image: string;
  groups: WorkspaceGroup[];
};

export const workspaceSpaces: WorkspaceSpace[] = [
  {
    id: "product-development",
    name: "Product Development",
    description: "Không gian làm việc cho các nhóm xây dựng sản phẩm, giao diện và backend chính.",
    image: "/spaces/product-development.svg",
    groups: [
      {
        id: "frontend-team",
        spaceId: "product-development",
        name: "Frontend Team",
        description: "Phụ trách giao diện, routing và trải nghiệm người dùng.",
        notes: [
          {
            id: "ui-layout",
            title: "UI Layout",
            summary: "Chuẩn hóa bố cục cho dashboard và sidebar.",
            content:
              "Hoàn thiện bố cục chính gồm header, sidebar và vùng nội dung để các màn hình mới có thể dùng lại dễ dàng.",
            updatedAt: "31/03/2026",
            color: "#8b5cf6",
            children: [
              {
                id: "ui-layout-1",
                title: "Chuẩn hóa header",
                summary: "Đồng bộ khoảng cách, tiêu đề và action trên phần đầu trang.",
                status: "Done",
              },
              {
                id: "ui-layout-2",
                title: "Responsive sidebar",
                summary: "Kiểm tra sidebar co giãn tốt trên mobile và tablet.",
                status: "In progress",
              },
            ],
          },
          {
            id: "auth-flow",
            title: "Auth Flow",
            summary: "Rà soát luồng đăng nhập và chuyển trang.",
            content:
              "Kiểm tra form đăng nhập, route bảo vệ và trải nghiệm sau khi user đăng nhập thành công.",
            updatedAt: "31/03/2026",
            color: "#3b82f6",
            children: [
              {
                id: "auth-flow-1",
                title: "Validate form",
                summary: "Bổ sung kiểm tra email và password trước khi submit.",
                status: "Done",
              },
              {
                id: "auth-flow-2",
                title: "Điều hướng sau login",
                summary: "Chuyển user đến workspace phù hợp sau khi đăng nhập thành công.",
                status: "To do",
              },
            ],
          },
        ],
      },
      {
        id: "backend-team",
        spaceId: "product-development",
        name: "Backend Team",
        description: "Quản lý API, database và luồng dữ liệu cho toàn hệ thống.",
        notes: [
          {
            id: "api-tasks",
            title: "API Tasks",
            summary: "Theo dõi endpoint và trạng thái tích hợp.",
            content:
              "Xác nhận danh sách API cần dùng cho workspace, note và quản lý group để frontend tích hợp đồng bộ.",
            updatedAt: "31/03/2026",
            color: "#f59e0b",
            children: [
              {
                id: "api-tasks-1",
                title: "Chuẩn hóa response",
                summary: "Đảm bảo response cho group và note có cùng format.",
                status: "In progress",
              },
              {
                id: "api-tasks-2",
                title: "Viết tài liệu API",
                summary: "Tổng hợp endpoint cho frontend dễ tích hợp.",
                status: "To do",
              },
            ],
          },
          {
            id: "database-plan",
            title: "Database Plan",
            summary: "Thiết kế cấu trúc lưu group và note.",
            content:
              "Chuẩn hóa bảng workspace, group, note và ràng buộc quan hệ để phục vụ mở rộng sau này.",
            updatedAt: "31/03/2026",
            color: "#10b981",
            children: [
              {
                id: "database-plan-1",
                title: "ERD schema",
                summary: "Hoàn thiện sơ đồ quan hệ giữa workspace, group và note.",
                status: "Done",
              },
              {
                id: "database-plan-2",
                title: "Migration draft",
                summary: "Chuẩn bị file migration cho các bảng chính.",
                status: "To do",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "quality-assurance",
    name: "Quality Assurance",
    description: "Không gian dành cho kiểm thử, checklist release và đánh giá chất lượng sản phẩm.",
    image: "/spaces/quality-assurance.svg",
    groups: [
      {
        id: "qa-team",
        spaceId: "quality-assurance",
        name: "QA Team",
        description: "Theo dõi kiểm thử giao diện, hành vi và độ ổn định của module workspace.",
        notes: [
          {
            id: "test-checklist",
            title: "Test Checklist",
            summary: "Danh sách kiểm thử nhanh cho module workspace.",
            content:
              "Kiểm tra điều hướng sidebar, mở note theo group, responsive trên mobile và hiển thị nội dung mặc định.",
            updatedAt: "31/03/2026",
            color: "#ef4444",
            children: [
              {
                id: "test-checklist-1",
                title: "Smoke test UI",
                summary: "Kiểm tra nhanh luồng mở group, mở note và modal chi tiết.",
                status: "In progress",
              },
              {
                id: "test-checklist-2",
                title: "Responsive check",
                summary: "Xác nhận lưới note hoạt động tốt trên nhiều kích thước màn hình.",
                status: "To do",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const workspaceGroups: WorkspaceGroup[] = workspaceSpaces.flatMap((space) => space.groups);

export const findSpaceById = (id?: string) => workspaceSpaces.find((space) => space.id === id);

export const findGroupById = (id?: string) => workspaceGroups.find((group) => group.id === id);

export const findSpaceByGroupId = (groupId?: string) =>
  workspaceSpaces.find((space) => space.groups.some((group) => group.id === groupId));
