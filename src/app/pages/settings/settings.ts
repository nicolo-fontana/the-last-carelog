import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BackupService } from '../../services/backup.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>{{ 'SETTINGS.TITLE' | translate }}</h1>

      <section class="language-section">
        <h2>{{ 'SETTINGS.LANGUAGE' | translate }}</h2>
        <div class="language-actions">
          <button
            type="button"
            [class.selected]="languageService.language() === 'en'"
            (click)="languageService.setLanguage('en')"
          >
            EN
          </button>
          <button
            type="button"
            [class.selected]="languageService.language() === 'it'"
            (click)="languageService.setLanguage('it')"
          >
            IT
          </button>
        </div>
      </section>

      <section class="backup-section">
        <h2>{{ 'SETTINGS.BACKUP_TITLE' | translate }}</h2>
        <div class="backup-actions">
          <button type="button" (click)="onExport()">{{ 'SETTINGS.EXPORT' | translate }}</button>
          <button type="button" (click)="fileInput.click()">{{ 'SETTINGS.IMPORT' | translate }}</button>
          <input
            #fileInput
            type="file"
            accept="application/json"
            class="visually-hidden"
            (change)="onImport($event)"
          />
        </div>
        @if (statusMessageKey()) {
          <p aria-live="polite">{{ statusMessageKey() | translate }}</p>
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

    .language-section,
    .backup-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .language-actions,
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

    button.selected {
      background: var(--p-primary-color, #2563eb);
      color: var(--p-primary-contrast-color, #fff);
      border-color: var(--p-primary-color, #2563eb);
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
  protected readonly languageService = inject(LanguageService);

  private readonly backupService = inject(BackupService);

  protected readonly statusMessageKey = signal('');

  protected onExport(): void {
    this.backupService.exportToFile();
    this.statusMessageKey.set('SETTINGS.EXPORTED');
  }

  protected async onImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    await this.backupService.importFromFile(file);
    input.value = '';
    this.statusMessageKey.set('SETTINGS.IMPORTED');
  }
}
