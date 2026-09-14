import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="'NAV.PRIMARY' | translate">
      <ul>
        <li>
          <a routerLink="/locations" routerLinkActive="active" ariaCurrentWhenActive="page">
            {{ 'NAV.LOCATIONS' | translate }}
          </a>
        </li>
        <li>
          <a routerLink="/settings" routerLinkActive="active" ariaCurrentWhenActive="page">
            {{ 'NAV.SETTINGS' | translate }}
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: `
    nav {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      background: var(--p-content-background, #fff);
      border-top: 1px solid var(--p-content-border-color, #ddd);
    }

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      flex: 1;
    }

    a {
      display: block;
      padding: 0.75rem 0.5rem;
      text-align: center;
      text-decoration: none;
      color: inherit;
    }

    a.active {
      font-weight: bold;
    }
  `,
})
export class BottomNav {}
