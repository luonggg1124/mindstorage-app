export type UserGender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

export interface ISimpleUserDto {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  fullName: string;
  gender: UserGender;
}

