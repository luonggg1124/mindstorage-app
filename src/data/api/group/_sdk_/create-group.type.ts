export type CreateGroupRequest = {
  body: {
    name: string;
    description: string;
    spaceId: string;
  };
};

export type CreateGroupResponse = {
  201: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateGroupError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

