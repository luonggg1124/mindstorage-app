
import type { RoleAction } from "@/data/types/role-action";
import type { ISimpleUserDto } from "@/data/api/user";

export interface IMySpaceDto {
    id: string;
    name: string;
    description: string;
    imageUrl?: string | null;
    groupCount: number;
    owner?: ISimpleUserDto | null;
    role?: RoleAction | null;
    lastActivityAt?: string | null;
    createdAt: string;
    updatedAt: string;
}