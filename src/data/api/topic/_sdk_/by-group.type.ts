import type { ITopicByGroupDto } from "../_dto_/topic-by-group.dto";

export type TopicsByGroupRequest = {
  params: {
    id: string;
  };
};

export type TopicsByGroupResponse = {
  200: ITopicByGroupDto[];
};

export type TopicsByGroupError = {
  [key: number]: {
    message: string;
    status: number;
  };
};
