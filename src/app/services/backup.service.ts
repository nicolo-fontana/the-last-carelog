import { Injectable, inject } from '@angular/core';

import { BackupDto } from '../models/backup.dto';
import { LanguageService } from './language.service';
import { LocationProgressService } from './location-progress.service';
import { UserLocationsService } from './user-locations.service';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly userLocationsService = inject(UserLocationsService);
  private readonly locationProgressService = inject(LocationProgressService);
  private readonly languageService = inject(LanguageService);

  exportToFile(filename = 'the-last-carelog-backup.json'): void {
    const backup: BackupDto = {
      userLocations: this.userLocationsService.locations(),
      locationProgress: this.locationProgressService.progresses(),
      language: this.languageService.language(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async importFromFile(file: File): Promise<void> {
    const backup = JSON.parse(await file.text()) as BackupDto;
    this.userLocationsService.setAll(backup.userLocations);
    this.locationProgressService.setAll(backup.locationProgress);
    if (backup.language) {
      this.languageService.setLanguage(backup.language);
    }
  }
}
