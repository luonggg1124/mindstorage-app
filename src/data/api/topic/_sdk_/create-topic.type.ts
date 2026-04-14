export type CreateTopicRequest = {
  body: {
    name: string;
    groupId: number;
  };
};

export type CreateTopicResponse = {
  201: {
    id: number;
    name: string;
    groupId: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateTopicError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};
