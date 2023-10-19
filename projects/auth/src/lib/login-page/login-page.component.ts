import { Component, inject } from '@angular/core';
import { AuthStateService } from '@book-co/shared-state-auth';
import { LoginPageActions } from '@book-co/auth/actions';

@Component({
  selector: 'bco-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  store = inject(AuthStateService).store;

  gettingStatus$ = this.store.gettingStatus$;
  user$ = this.store.user$;
  error$ = this.store.error$;

  login$ = LoginPageActions.login$;
}
