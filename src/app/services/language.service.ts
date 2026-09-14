import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppLanguage } from '../models/language.dto';

const STORAGE_KEY = 'language';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'it'];
const DEFAULT_LANGUAGE: AppLanguage = 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);

  private readonly languageSignal = signal<AppLanguage>(
    this.readFromStorage() ?? this.detectBrowserLanguage(),
  );

  readonly language = this.languageSignal.asReadonly();

  constructor() {
    this.translateService.use(this.languageSignal());
  }

  setLanguage(language: AppLanguage): void {
    this.languageSignal.set(language);
    this.translateService.use(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  private readFromStorage(): AppLanguage | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw && SUPPORTED_LANGUAGES.includes(raw as AppLanguage) ? (raw as AppLanguage) : null;
  }

  private detectBrowserLanguage(): AppLanguage {
    const browserLang = this.translateService.getBrowserLang();
    return browserLang && SUPPORTED_LANGUAGES.includes(browserLang as AppLanguage)
      ? (browserLang as AppLanguage)
      : DEFAULT_LANGUAGE;
  }
}
