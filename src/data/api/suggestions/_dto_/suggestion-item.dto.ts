export type SuggestionTypeDto = "GROUP" | "SPACE";

export type ISuggestionItemDto = {
  type: SuggestionTypeDto;
  id: string; // UUID
  name: string;
  lastActivityAt: string; // LocalDateTime
};

