import { UserGender } from "@/data/models/user";


export interface ISimpleUserDto {
  id: string;
  username: string;
  avatarUrl: string | null;
  fullName: string;
  gender: UserGender;
}

