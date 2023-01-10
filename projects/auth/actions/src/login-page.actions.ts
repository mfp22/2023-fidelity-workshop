import { Source } from '@state-adapt/rxjs';
import { LoginEvent } from 'projects/auth/src/lib/login-form/login-form.component';

export const enter$ = new Source<void>('enter$');
export const login$ = new Source<LoginEvent>('login$');
