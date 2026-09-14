import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { StatusSelector } from '../../components/status-selector/status-selector';
import { LocationStatus } from '../../models/location-progress.dto';
import { LocationProgressService } from '../../services/location-progress.service';
import { LocationsService } from '../../services/locations.service';
import { UserLocationsService } from '../../services/user-locations.service';

interface LocationDisplayItem {
  id: string;
  name: string;
  category?: string;
  x?: number;
  y?: number;
}

@Component({
  selector: 'app-location-detail',
  imports: [StatusSelector, ReactiveFormsModule, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (location(); as loc) {
      <main>
        <a class="back-link" routerLink="/locations">{{ 'LOCATION_DETAIL.BACK' | translate }}</a>

        <div class="header-row">
          <h1>{{ loc.name }}</h1>
          @if (isUserLocation()) {
            <a class="edit-link" [routerLink]="['/locations', loc.id, 'edit']">
              {{ 'LOCATION_DETAIL.EDIT' | translate }}
            </a>
          }
        </div>

        <section class="info-card" [attr.aria-label]="'LOCATION_DETAIL.INFO_LABEL' | translate">
          <dl>
            <div>
              <dt>{{ 'LOCATION_DETAIL.CATEGORY' | translate }}</dt>
              <dd>{{ categoryName() ?? '—' }}</dd>
            </div>
            <div>
              <dt>{{ 'LOCATION_DETAIL.X' | translate }}</dt>
              <dd>{{ loc.x ?? '—' }}</dd>
            </div>
            <div>
              <dt>{{ 'LOCATION_DETAIL.Y' | translate }}</dt>
              <dd>{{ loc.y ?? '—' }}</dd>
            </div>
          </dl>
        </section>

        <app-status-selector [value]="status()" (valueChange)="onStatusChange($event)" />

        <div class="notes-field">
          <label for="notes">{{ 'LOCATION_DETAIL.NOTES' | translate }}</label>
          <textarea id="notes" rows="10" [formControl]="notesControl" (blur)="onNotesBlur()"></textarea>
        </div>
      </main>
    }
  `,
  styles: `
    main {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem 1rem 5rem;
    }

    .back-link {
      align-self: flex-start;
      color: inherit;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover,
    .back-link:focus-visible {
      text-decoration: underline;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .header-row h1 {
      margin: 0;
    }

    .edit-link {
      flex-shrink: 0;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--p-content-border-color, #ddd);
      color: inherit;
      text-decoration: none;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .info-card {
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .info-card dl {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 0;
    }

    .info-card dt {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--p-text-muted-color, #666);
    }

    .info-card dd {
      margin: 0;
      font-size: 1rem;
    }

    .notes-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .notes-field textarea {
      width: 100%;
      min-height: 12rem;
      padding: 0.75rem;
      font: inherit;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      resize: vertical;
      box-sizing: border-box;
    }
  `,
})
export class LocationDetail {
  readonly id = input.required<string>();

  private readonly locationsService = inject(LocationsService);
  private readonly userLocationsService = inject(UserLocationsService);
  private readonly locationProgressService = inject(LocationProgressService);

  private readonly fetchedLocations = toSignal(this.locationsService.getLocations(), {
    initialValue: null,
  });

  protected readonly location = computed<LocationDisplayItem | undefined>(() => {
    const currentId = this.id();
    const wikiMatch = this.fetchedLocations()?.locations.find((l) => l.id === currentId);
    if (wikiMatch) {
      return wikiMatch;
    }
    return this.userLocationsService.locations().find((l) => l.id === currentId);
  });

  protected readonly isUserLocation = computed(() =>
    this.userLocationsService.locations().some((l) => l.id === this.id()),
  );

  protected readonly categoryName = computed(() => {
    const categoryId = this.location()?.category;
    if (!categoryId) {
      return undefined;
    }
    return this.fetchedLocations()?.categories.find((c) => c.id === categoryId)?.name;
  });

  protected readonly status = computed<LocationStatus>(
    () => this.locationProgressService.getProgress(this.id())()?.status ?? 'new',
  );

  protected readonly notesControl = new FormControl('', { nonNullable: true });

  constructor() {
    effect(() => {
      const currentId = this.id();
      const notes = this.locationProgressService.getProgress(currentId)()?.notes ?? '';
      this.notesControl.setValue(notes, { emitEvent: false });
    });
  }

  protected onStatusChange(status: LocationStatus): void {
    this.locationProgressService.createProgress({
      locationId: this.id(),
      status,
      notes: this.notesControl.value,
    });
  }

  protected onNotesBlur(): void {
    this.locationProgressService.createProgress({
      locationId: this.id(),
      status: this.status(),
      notes: this.notesControl.value,
    });
  }
}
