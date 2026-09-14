export type LocationStatus = 'new' | 'visited' | 'completed';

export interface LocationProgressDto {
  locationId: string;
  status: LocationStatus;
  notes: string;
}
