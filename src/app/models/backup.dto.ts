import { LocationProgressDto } from './location-progress.dto';
import { UserLocationDto } from './user-location.dto';

export interface BackupDto {
  userLocations: UserLocationDto[];
  locationProgress: LocationProgressDto[];
}
