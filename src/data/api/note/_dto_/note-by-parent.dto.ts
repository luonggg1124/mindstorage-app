import type { ISimpleUserDto } from "@/data/api/user";

export interface INoteByParentDto {
  id: string;
  title: string;
  content: string;
  creator: ISimpleUserDto;
  createdAt: string;
  updatedAt: string;
}

