import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>{{ 'LANDING.TITLE' | translate }}</h1>
      <p>{{ 'LANDING.DESCRIPTION' | translate }}</p>
      <a routerLink="/locations">{{ 'LANDING.VIEW_LOCATIONS' | translate }}</a>
    </main>
  `,
})
export class Landing {}
