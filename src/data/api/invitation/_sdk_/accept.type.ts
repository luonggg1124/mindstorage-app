export type AcceptInvitationRequest = {
  params: {
    id: string;
  };
};

export type AcceptInvitationResponse = {
  200: {
    success: boolean;
  };
};

export type AcceptInvitationError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

