import {
  BookModel,
  BookRequiredProps,
  isBookModel,
} from '@book-co/shared-models';
import { Action } from '@state-adapt/core';
import { Source } from '@state-adapt/rxjs';

// https://state-adapt.github.io/docs/rxjs#source
export const saveBook$ = new Source<BookRequiredProps | BookModel>('saveBook$');
export const deleteBook$ = new Source<string>('deleteBook$');

// https://state-adapt.github.io/docs/core#action
export function isBookModelAction(action: any): action is Action<BookModel> {
  return isBookModel(action.payload);
}
