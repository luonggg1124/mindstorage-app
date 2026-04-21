import { UserGender } from "@/data/models/user";


export interface IMyProfileDto {
  id: number;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  email: string;
  hobbies: string;
  gender: UserGender | null;
  followersCount: number;
  followingCount: number;
  spacesCount: number;
  spaceMembersCount: number;
}

