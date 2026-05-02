export enum RoleAction {
    EDITOR = "EDITOR",
    VIEWER = "VIEWER",
    OWNER = "OWNER",
}

export function canEditByRole(role: RoleAction | null | undefined) {
  return role === RoleAction.OWNER || role === RoleAction.EDITOR;
}

export function canDeleteByRole(role: RoleAction | null | undefined) {
  return role === RoleAction.OWNER;
}