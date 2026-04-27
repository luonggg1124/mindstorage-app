export type RejectInvitationRequest = {
  params: {
    id: string;
  };
};

export type RejectInvitationResponse = {
  200: {
    success: boolean;
  };
};

export type RejectInvitationError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

