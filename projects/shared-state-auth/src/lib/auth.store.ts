import { createAdapter } from '@state-adapt/core';
import { Injectable, inject } from '@angular/core';
import { adapt } from '@state-adapt/angular';

import { UserModel } from '@book-co/shared-models';
import { LoginPageActions, UserDropdownActions } from '@book-co/auth/actions';
import { AuthService } from '@book-co/shared-services';
import { concatMap, tap } from 'rxjs/operators';
import {
  splitRequestSources,
  toRequestSource,
  toSource,
} from '@state-adapt/rxjs';

export interface State {
  gettingStatus: boolean;
  user: null | UserModel;
  error: null | string;
}

const initialState: State = {
  gettingStatus: true,
  user: null,
  error: null,
};

// https://state-adapt.github.io/docs/core#createadapter
export const adapter = createAdapter<State>()({
  logOut: () => ({
    gettingStatus: false,
    user: null,
    error: null,
  }),
  logIn: () => ({
    gettingStatus: true,
    user: null,
    error: null,
  }),
  receiveUser: (state, user: UserModel | null) => ({
    gettingStatus: false,
    user,
    error: null,
  }),
  receiveError: (state, reason: string) => ({
    gettingStatus: false,
    user: null,
    error: reason,
  }),
  selectors: {
    gettingStatus: (state) => state.gettingStatus,
    user: (state) => state.user,
    error: (state) => state.error,
  },
});

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  store = adapt(initialState, {
    adapter,
    sources: () => {
      const auth = inject(AuthService);

      const user$ = auth.getStatus().pipe(toSource('user$')); // https://state-adapt.github.io/docs/rxjs#tosource

      const login$ = LoginPageActions.login$.pipe(
        concatMap(({ payload }) =>
          auth.login(payload.username, payload.password)
        ),
        toRequestSource('auth') // https://state-adapt.github.io/docs/rxjs#torequestsource
      );
      const loginRequest = splitRequestSources('auth', login$); // https://state-adapt.github.io/docs/rxjs#splitrequestsources

      const logoutSuccess$ = UserDropdownActions.logout$.pipe(
        tap(() => auth.logout()),
        toSource('logoutSuccess$') // https://state-adapt.github.io/docs/rxjs#tosource
      );

      return {
        logIn: LoginPageActions.login$,
        logOut: UserDropdownActions.logout$,
        receiveUser: [user$, loginRequest.success$],
        receiveError: loginRequest.error$,
        noop: logoutSuccess$,
      };
    },
    path: 'auth',
  });
}
