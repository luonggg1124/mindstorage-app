export type UpdateTopicRequest = {
  params: {
    id: string | number;
  };
  body: {
    name: string;
    groupId: string;
  };
};

export type UpdateTopicResponse = {
  201: {
    id: string;
    name: string;
    groupId: string;
    createdAt: string;
    updatedAt: string;
  };
};

