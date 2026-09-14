import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LocationProgressService } from '../../services/location-progress.service';

@Component({
  selector: 'app-location-card',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="location-card" [routerLink]="['/location', id()]">
      <h2>{{ name() }}</h2>
      <span class="status-badge" [class]="status()">{{ 'STATUS.' + status().toUpperCase() | translate }}</span>
    </a>
  `,
  styles: `
    .location-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      text-decoration: none;
      color: inherit;
    }

    .location-card h2 {
      margin: 0;
      font-size: 1rem;
    }

    .status-badge {
      flex-shrink: 0;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: capitalize;
      background: var(--p-content-border-color, #ddd);
    }

    .status-badge.visited {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }
  `,
})
export class LocationCard {
  readonly id = input.required<string>();
  readonly name = input.required<string>();

  private readonly locationProgressService = inject(LocationProgressService);

  protected readonly status = computed(
    () => this.locationProgressService.getProgress(this.id())()?.status ?? 'new',
  );
}
