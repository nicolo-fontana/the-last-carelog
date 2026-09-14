import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LocationsDto } from '../models/locations.dto';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly http = inject(HttpClient);

  getLocations(): Observable<LocationsDto> {
    return this.http.get<LocationsDto>('data/locations.json');
  }
}
