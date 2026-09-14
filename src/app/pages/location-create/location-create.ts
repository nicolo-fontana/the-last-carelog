import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { UserLocationsService } from '../../services/user-locations.service';

@Component({
  selector: 'app-location-create',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <a class="back-link" routerLink="/locations">{{ 'LOCATION_DETAIL.BACK' | translate }}</a>

      <h1>{{ (id() ? 'LOCATION_FORM.TITLE_EDIT' : 'LOCATION_FORM.TITLE_NEW') | translate }}</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="name">{{ 'LOCATION_FORM.NAME' | translate }}</label>
          <input id="name" type="text" formControlName="name" required />
        </div>

        <div class="field-row">
          <div class="field">
            <label for="x">{{ 'LOCATION_FORM.X' | translate }}</label>
            <input id="x" type="number" formControlName="x" />
          </div>
          <div class="field">
            <label for="y">{{ 'LOCATION_FORM.Y' | translate }}</label>
            <input id="y" type="number" formControlName="y" />
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid">
          {{ (id() ? 'LOCATION_FORM.SUBMIT_EDIT' : 'LOCATION_FORM.SUBMIT_NEW') | translate }}
        </button>
      </form>
    </main>
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

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      flex: 1;
    }

    .field-row {
      display: flex;
      gap: 1rem;
    }

    input {
      width: 100%;
      padding: 0.625rem 0.75rem;
      font: inherit;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      box-sizing: border-box;
    }

    button {
      align-self: flex-start;
      padding: 0.625rem 1.25rem;
      border: 0;
      border-radius: 0.5rem;
      background: var(--p-primary-color, #2563eb);
      color: var(--p-primary-contrast-color, #fff);
      font: inherit;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class LocationCreate {
  readonly id = input<string>();

  private readonly userLocationsService = inject(UserLocationsService);
  private readonly router = inject(Router);

  private readonly editedLocation = computed(() => {
    const currentId = this.id();
    return currentId
      ? this.userLocationsService.locations().find((location) => location.id === currentId)
      : undefined;
  });

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    x: new FormControl<number | null>(null),
    y: new FormControl<number | null>(null),
  });

  constructor() {
    effect(() => {
      const location = this.editedLocation();
      if (location) {
        this.form.setValue({
          name: location.name,
          x: location.x ?? null,
          y: location.y ?? null,
        });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const { name, x, y } = this.form.getRawValue();
    const currentId = this.id();

    if (currentId) {
      this.userLocationsService.updateLocation(currentId, {
        name,
        x: x ?? undefined,
        y: y ?? undefined,
      });
      this.router.navigate(['/location', currentId]);
      return;
    }

    const location = this.userLocationsService.addLocation({
      name,
      x: x ?? undefined,
      y: y ?? undefined,
    });
    this.router.navigate(['/location', location.id]);
  }
}
