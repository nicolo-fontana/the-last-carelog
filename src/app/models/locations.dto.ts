export interface LocationCategoryDto {
  id: string;
  name: string;
}

export interface LocationDto {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
}

export interface LocationsDto {
  categories: LocationCategoryDto[];
  locations: LocationDto[];
}
