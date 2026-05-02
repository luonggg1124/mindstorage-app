export type CreateNoteRequest = {
  body: {
    title: string;
    content?: string;
    topicId: string;
    parentId?: string | null;
  };
};

export type CreateNoteResponse = {
  201: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
};

