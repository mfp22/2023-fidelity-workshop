import { InjectionToken, inject } from '@angular/core';
import { BooksPageActions } from '@book-co/books-page/actions';
import { BookModel } from '@book-co/shared-models';
import { BooksService } from '@book-co/shared-services';
import { adapt } from '@state-adapt/angular';
import { getAction } from '@state-adapt/core';
import { createEntityState } from '@state-adapt/core/adapters';
import { Source, getRequestSources, toSource } from '@state-adapt/rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { State, adapter } from './books.adapter';

export const initialState: State = {
  activeBookId: null,
  isLoading: true,
  error: null,
  books: createEntityState(),
};

export const BooksStore = new InjectionToken('BooksStore', {
  providedIn: 'root',
  factory: () => {
    const booksService = inject(BooksService);

    const booksRequest = getRequestSources(booksService.all(), 'books');

    const bookCreated$ = BooksPageActions.saveBook$.pipe(
      filter(({ payload }) => !('id' in payload)),
      concatMap(({ payload }) => booksService.create(payload)),
      toSource('bookCreated$')
    );

    const bookUpdated$ = BooksPageActions.saveBook$.pipe(
      filter(BooksPageActions.isBookModelAction),
      concatMap(({ payload }) =>
        booksService
          .update(payload.id, payload)
          .pipe(map((book) => getAction('bookUpdated$', [book.id, book])))
      )
    );

    const bookDeleted$ = BooksPageActions.deleteBook$.pipe(
      concatMap(({ payload }) =>
        booksService
          .delete(payload)
          .pipe(map(() => getAction('bookDeleted$', payload)))
      )
    );

    return adapt(['books', initialState, adapter], {
      receiveBooks: booksRequest.success$,
      receiveError: booksRequest.error$,
      addBook: bookCreated$,
      updateBook: bookUpdated$ as Source<[string, BookModel]>,
      removeBooksOne: bookDeleted$,
    });
  },
});
