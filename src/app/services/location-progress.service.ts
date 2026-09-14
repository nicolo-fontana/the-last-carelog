import { Injectable, Signal, computed, signal } from '@angular/core';

import { LocationProgressDto } from '../models/location-progress.dto';

const STORAGE_KEY = 'location-progress';

@Injectable({
  providedIn: 'root',
})
export class LocationProgressService {
  private readonly progressesSignal = signal<LocationProgressDto[]>(this.readFromStorage());

  readonly progresses = this.progressesSignal.asReadonly();

  getProgress(locationId: string): Signal<LocationProgressDto | undefined> {
    return computed(() =>
      this.progressesSignal().find((progress) => progress.locationId === locationId),
    );
  }

  createProgress(progress: LocationProgressDto): void {
    this.progressesSignal.update((progresses) => [
      ...progresses.filter((existing) => existing.locationId !== progress.locationId),
      progress,
    ]);
    this.persist();
  }

  updateProgress(locationId: string, changes: Partial<Omit<LocationProgressDto, 'locationId'>>): void {
    this.progressesSignal.update((progresses) =>
      progresses.map((progress) =>
        progress.locationId === locationId ? { ...progress, ...changes } : progress,
      ),
    );
    this.persist();
  }

  setAll(progresses: LocationProgressDto[]): void {
    this.progressesSignal.set(progresses);
    this.persist();
  }

  private readFromStorage(): LocationProgressDto[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocationProgressDto[]) : [];
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progressesSignal()));
  }
}
