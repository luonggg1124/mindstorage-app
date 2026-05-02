export type UpdateGroupRequest = {
  params: {
    id: string | number;
  };
  body: {
    name: string;
    description?: string;
    spaceId: string;
  };
};

export type UpdateGroupResponse = {
  201: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

