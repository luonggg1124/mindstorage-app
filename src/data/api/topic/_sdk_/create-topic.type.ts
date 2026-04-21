export type CreateTopicRequest = {
  body: {
    name: string;
    groupId: string;
  };
};

export type CreateTopicResponse = {
  201: {
    id: string;
    name: string;
    groupId: string;
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
