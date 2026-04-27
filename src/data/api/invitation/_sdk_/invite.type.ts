export type InvitationEntityType = "SPACE" | "GROUP";

export type InviteRequest = {
  body: {
    inviteeId: number;
    entityId: string;
    entityType: InvitationEntityType;
  };
};

export type InviteResponse = {
  200: {
    success: boolean;
  };
};

export type InviteError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

