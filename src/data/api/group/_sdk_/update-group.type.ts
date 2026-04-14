export type UpdateGroupRequest = {
  params: {
    id: string | number;
  };
  body: {
    name: string;
    description?: string;
    spaceId: number;
  };
};

export type UpdateGroupResponse = {
  201: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateGroupError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

