import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>The Last CareLog</h1>
      <p>Track your locations and keep your care log up to date.</p>
      <a routerLink="/locations">View locations</a>
    </main>
  `,
})
export class Landing {}
