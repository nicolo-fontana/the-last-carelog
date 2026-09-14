import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BackupService } from '../../services/backup.service';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Settings</h1>

      <section class="backup-section">
        <h2>Backup</h2>
        <div class="backup-actions">
          <button type="button" (click)="onExport()">Export data</button>
          <button type="button" (click)="fileInput.click()">Import data</button>
          <input
            #fileInput
            type="file"
            accept="application/json"
            class="visually-hidden"
            (change)="onImport($event)"
          />
        </div>
        @if (statusMessage()) {
          <p aria-live="polite">{{ statusMessage() }}</p>
        }
      </section>
    </main>
  `,
  styles: `
    main {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem 1rem 5rem;
    }

    .backup-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .backup-actions {
      display: flex;
      gap: 0.75rem;
    }

    button {
      padding: 0.625rem 1.25rem;
      border: 1px solid var(--p-content-border-color, #ddd);
      border-radius: 0.5rem;
      background: var(--p-content-background, #fff);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
})
export class Settings {
  private readonly backupService = inject(BackupService);

  protected readonly statusMessage = signal('');

  protected onExport(): void {
    this.backupService.exportToFile();
    this.statusMessage.set('Data exported.');
  }

  protected async onImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    await this.backupService.importFromFile(file);
    input.value = '';
    this.statusMessage.set('Data imported.');
  }
}
