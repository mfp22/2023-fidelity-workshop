import { Component } from '@angular/core';
import { UserDropdownActions } from '@book-co/auth/actions';
import { injectAuthStore } from '@book-co/shared-state-auth';

@Component({
  selector: 'bco-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
})
export class UserDropdownComponent {
  store = injectAuthStore();

  user$ = this.store.user$;

  logout$ = UserDropdownActions.logout$;
}
