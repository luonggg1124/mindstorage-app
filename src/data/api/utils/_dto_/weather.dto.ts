export interface IWeatherLocationDto {
  country: string;
  city: string;
  locality: string;
  languageCode: string;
  countryCode: string;
  principalSubdivisionCode: string;
}

export interface IWeatherDto {
  lastUpdated: string;
  tempC: number;
  isDay: number;
  conditionText: string;
  conditionIcon: string;
  windKph: number;
  humidity: number;
  cloud: number;
  feelslikeC: number;
}

export interface IWeatherResponseDto {
  location: IWeatherLocationDto;
  weather: IWeatherDto;
}

