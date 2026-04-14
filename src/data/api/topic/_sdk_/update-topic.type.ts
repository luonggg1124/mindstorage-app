export type UpdateTopicRequest = {
  params: {
    id: string | number;
  };
  body: {
    name: string;
    groupId: number;
  };
};

export type UpdateTopicResponse = {
  201: {
    id: number;
    name: string;
    groupId: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateTopicError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

