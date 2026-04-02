export type ProfileRecord = {
  id: string;
  name: string;
  role: string;
  major: string;
  email: string;
  location: string;
  bio: string;
  skills: string[];
  highlights: string[];
  stats: {
    posts: number;
    followers: number;
    groups: number;
  };
};

export const profiles: ProfileRecord[] = [
  {
    id: "nguyen-van-a",
    name: "Nguyen Van A",
    role: "Frontend Developer",
    major: "Công nghệ phần mềm",
    email: "student@example.com",
    location: "TP. Hồ Chí Minh",
    bio: "Yêu thích xây dựng giao diện rõ ràng, responsive và dễ dùng cho các bài tập nhóm.",
    skills: ["React", "TypeScript", "TailwindCSS", "UI/UX"],
    highlights: [
      "Hoàn thiện layout chính cho assignment trong tuần này.",
      "Phụ trách kết nối routing và tối ưu trải nghiệm người dùng.",
      "Đang chuẩn bị demo profile và dashboard cho nhóm.",
    ],
    stats: {
      posts: 18,
      followers: 124,
      groups: 5,
    },
  },
  {
    id: "tran-minh-khoa",
    name: "Trần Minh Khoa",
    role: "Backend Developer",
    major: "Khoa học máy tính",
    email: "khoa.dev@example.com",
    location: "Đà Nẵng",
    bio: "Tập trung vào API, database và tối ưu luồng dữ liệu cho ứng dụng nhóm.",
    skills: ["Java", "Spring Boot", "PostgreSQL", "REST API"],
    highlights: [
      "Thiết kế schema cho module nhóm học tập.",
      "Viết API quản lý user và permissions.",
      "Hỗ trợ tích hợp dữ liệu profile giữa frontend và backend.",
    ],
    stats: {
      posts: 11,
      followers: 87,
      groups: 4,
    },
  },
  {
    id: "le-thao-uyen",
    name: "Lê Thảo Uyên",
    role: "Product Designer",
    major: "Hệ thống thông tin",
    email: "uyen.design@example.com",
    location: "Cần Thơ",
    bio: "Quan tâm đến trải nghiệm học tập trực tuyến và thiết kế giao diện thân thiện cho sinh viên.",
    skills: ["Figma", "Design System", "Research", "Prototype"],
    highlights: [
      "Chuẩn hóa bộ màu và component cho app.",
      "Thiết kế luồng profile cá nhân và public profile.",
      "Phối hợp kiểm thử UI trên mobile và desktop.",
    ],
    stats: {
      posts: 14,
      followers: 156,
      groups: 6,
    },
  },
];

export const currentUserId = "nguyen-van-a";

export const currentUserProfile =
  profiles.find((profile) => profile.id === currentUserId) ?? profiles[0];

export const otherProfiles = profiles.filter((profile) => profile.id !== currentUserId);

export const findProfileById = (id?: string) => profiles.find((profile) => profile.id === id);
