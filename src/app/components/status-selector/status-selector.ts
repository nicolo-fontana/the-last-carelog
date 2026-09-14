import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LocationStatus } from '../../models/location-progress.dto';

interface StatusOption {
  value: LocationStatus;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'new', label: 'New' },
  { value: 'visited', label: 'Visited' },
  { value: 'completed', label: 'Completed' },
];

@Component({
  selector: 'app-status-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="status-selector">
      <legend>Status</legend>
      @for (option of options; track option.value) {
        <label class="status-option" [class.selected]="option.value === value()">
          <input
            type="radio"
            name="status"
            [value]="option.value"
            [checked]="option.value === value()"
            (change)="valueChange.emit(option.value)"
          />
          {{ option.label }}
        </label>
      }
    </fieldset>
  `,
  styles: `
    .status-selector {
      display: flex;
      gap: 0.5rem;
      border: 0;
      padding: 0;
      margin: 0;
    }

    legend {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    .status-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      cursor: pointer;
      text-align: center;
    }

    .status-option.selected {
      background: var(--p-primary-color, #2563eb);
      color: var(--p-primary-contrast-color, #fff);
      border-color: var(--p-primary-color, #2563eb);
    }

    .status-option input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
})
export class StatusSelector {
  readonly value = input.required<LocationStatus>();
  readonly valueChange = output<LocationStatus>();

  protected readonly options = STATUS_OPTIONS;
}
