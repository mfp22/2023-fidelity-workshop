import { Component } from '@angular/core';
import { injectAuthStore } from '@book-co/shared-state-auth';
import { LoginPageActions } from '@book-co/auth/actions';

@Component({
  selector: 'bco-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  store = injectAuthStore();

  gettingStatus$ = this.store.gettingStatus$;
  user$ = this.store.user$;
  error$ = this.store.error$;

  login$ = LoginPageActions.login$;
}
