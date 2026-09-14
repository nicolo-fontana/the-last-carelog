import { Injectable, signal } from '@angular/core';

import { UserLocationDto } from '../models/user-location.dto';

const STORAGE_KEY = 'user-locations';

@Injectable({
  providedIn: 'root',
})
export class UserLocationsService {
  private readonly locationsSignal = signal<UserLocationDto[]>(this.readFromStorage());

  readonly locations = this.locationsSignal.asReadonly();

  addLocation(location: Omit<UserLocationDto, 'id'>): UserLocationDto {
    const newLocation: UserLocationDto = { ...location, id: crypto.randomUUID() };
    this.locationsSignal.update((locations) => [...locations, newLocation]);
    this.persist();
    return newLocation;
  }

  updateLocation(id: string, changes: Partial<Omit<UserLocationDto, 'id'>>): void {
    this.locationsSignal.update((locations) =>
      locations.map((location) => (location.id === id ? { ...location, ...changes } : location)),
    );
    this.persist();
  }

  removeLocation(id: string): void {
    this.locationsSignal.update((locations) => locations.filter((location) => location.id !== id));
    this.persist();
  }

  setAll(locations: UserLocationDto[]): void {
    this.locationsSignal.set(locations);
    this.persist();
  }

  private readFromStorage(): UserLocationDto[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserLocationDto[]) : [];
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.locationsSignal()));
  }
}
