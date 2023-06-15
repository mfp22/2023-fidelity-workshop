import { Source } from '@state-adapt/rxjs';

// https://state-adapt.github.io/docs/rxjs#source
export const logout$ = new Source<void>('logout$');
