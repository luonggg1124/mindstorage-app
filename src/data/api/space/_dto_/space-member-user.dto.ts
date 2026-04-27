import type { UserGender } from "@/data/models/user";

export type RoleActionDto = "EDITOR" | "VIEWER" | "OWNER";

export interface ISpaceMemberUserDto {
  id: number; // backend: Long
  username: string;
  avatarUrl: string | null;
  fullName: string;
  gender: UserGender;
  joinedAt: string; // ISO string
  role: RoleActionDto;
}

