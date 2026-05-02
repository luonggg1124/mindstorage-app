export type INotesDayDataDto = {
  date: string; // LocalDate from backend
  label: string;
  noteCreated: number;
};

export type ITopicItemDto = {
  id: string; // UUID
  name: string;
  count: number;
  percentage: number;
};

export type ITopicsDataDto = {
  total: number;
  items: ITopicItemDto[];
};

export type IStatisticsResponseDto = {
  notesData: INotesDayDataDto[];
  topicsData: ITopicsDataDto;
};

