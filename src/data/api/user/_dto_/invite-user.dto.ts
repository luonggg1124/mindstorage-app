import { UserGender } from "@/data/models/user";

export interface IInviteUserDto {
  id: number; // backend: Long
  username: string;
  avatarUrl: string | null;
  fullName: string;
  gender: UserGender;
  isMember: boolean;
}

export type InvitationTypeDto = "SPACE" | "GROUP";

