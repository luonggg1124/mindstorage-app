import type { IMySpaceRoleDto } from "../_dto_/my-space-role.dto";

export type MySpaceRoleRequest = {
  id: string | number;
};

export type MySpaceRoleResponse = {
  200: IMySpaceRoleDto;
};
