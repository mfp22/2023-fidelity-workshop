import { Component, inject } from '@angular/core';
import { AuthStore } from '@book-co/shared-state-auth';
import { LoginPageActions } from '@book-co/auth/actions';

@Component({
  selector: 'bco-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  store = inject(AuthStore);

  gettingStatus$ = this.store.gettingStatus$;
  user$ = this.store.user$;
  error$ = this.store.error$;

  login$ = LoginPageActions.login$;
}
