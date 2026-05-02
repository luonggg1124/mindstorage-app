import type { ISuggestionItemDto } from "../_dto_";

export type SuggestionsRequest = {
  query?: {
    limit?: number;
  };
};

export type SuggestionsResponse = {
  200: ISuggestionItemDto[];
};

