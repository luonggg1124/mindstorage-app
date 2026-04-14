export type CreateNoteRequest = {
  body: {
    title: string;
    content?: string;
    topicId: number;
    parentId?: number | null;
  };
};

export type CreateNoteResponse = {
  201: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateNoteError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

