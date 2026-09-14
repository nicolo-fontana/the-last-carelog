import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LocationCard } from '../../components/location-card/location-card';
import { LocationsService } from '../../services/locations.service';
import { UserLocationsService } from '../../services/user-locations.service';

interface LocationListItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-location-list',
  imports: [LocationCard, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <div class="header-row">
        <h1>Locations</h1>
        <a class="add-button" routerLink="/locations/new">+ Add location</a>
      </div>

      <div class="filter-field">
        <label for="filter">Filter locations</label>
        <input id="filter" type="text" placeholder="Search by name…" [formControl]="filterControl" />
      </div>

      @if (filteredLocations().length) {
        <ul class="locations-list">
          @for (location of filteredLocations(); track location.id) {
            <li>
              <app-location-card [id]="location.id" [name]="location.name" />
            </li>
          }
        </ul>
      } @else {
        <p>{{ locations().length ? 'No locations match your filter.' : 'No locations yet.' }}</p>
      }
    </main>
  `,
  styles: `
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .header-row h1 {
      margin: 0;
    }

    .add-button {
      flex-shrink: 0;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: var(--p-primary-color, #2563eb);
      color: var(--p-primary-contrast-color, #fff);
      text-decoration: none;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin: 1rem 0;
    }

    .filter-field input {
      width: 100%;
      padding: 0.625rem 0.75rem;
      font: inherit;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      box-sizing: border-box;
    }

    .locations-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem;
      list-style: none;
      margin: 0;
      padding: 0 0 5rem;
    }
  `,
})
export class LocationList {
  private readonly locationsService = inject(LocationsService);
  private readonly userLocationsService = inject(UserLocationsService);

  protected readonly filterControl = new FormControl('', { nonNullable: true });

  private readonly fetchedLocations = toSignal(this.locationsService.getLocations(), {
    initialValue: null,
  });

  private readonly filterTerm = toSignal(this.filterControl.valueChanges, { initialValue: '' });

  protected readonly locations = computed<LocationListItem[]>(() => {
    const wikiLocations = this.fetchedLocations()?.locations ?? [];
    const userLocations = this.userLocationsService.locations();
    return [...wikiLocations, ...userLocations].map(({ id, name }) => ({ id, name }));
  });

  protected readonly filteredLocations = computed<LocationListItem[]>(() => {
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) {
      return this.locations();
    }
    return this.locations().filter((location) => location.name.toLowerCase().includes(term));
  });
}
