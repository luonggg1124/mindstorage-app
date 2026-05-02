import type { UserGender } from "@/data/models/user";
import type { RoleAction } from "@/data/types/role-action";

export interface ISpaceMemberUserDto {
  id: number; // backend: Long
  username: string;
  avatarUrl: string | null;
  fullName: string;
  gender: UserGender;
  joinedAt: string; // ISO string
  role: RoleAction;
}

