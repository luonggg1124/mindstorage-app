export type UpdateNoteRequest = {
  params: {
    id: string | number;
  };
  body: {
    title: string;
    content?: string;
    topicId: number;
  };
};

export type UpdateNoteResponse = {
  201: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateNoteError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

