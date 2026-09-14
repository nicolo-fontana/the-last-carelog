import { LocationDto } from './locations.dto';

export type UserLocationDto = Pick<LocationDto, 'id' | 'name'> &
  Partial<Pick<LocationDto, 'x' | 'y'>>;
