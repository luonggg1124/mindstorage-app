import type { ISpaceMemberUserDto } from "../_dto_";
import type { RoleAction } from "@/data/types/role-action";

export type UpdateSpaceMemberRoleRequest = {
  params: { spaceId: string; userId: number };
  body: {
    role: RoleAction;
  };
};

export type UpdateSpaceMemberRoleResponse = {
  201: ISpaceMemberUserDto;
};
