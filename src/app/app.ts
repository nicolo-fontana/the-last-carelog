import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BottomNav } from './components/bottom-nav/bottom-nav';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly languageService = inject(LanguageService);
}
