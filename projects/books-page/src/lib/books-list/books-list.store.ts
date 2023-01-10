import { Injectable, InjectionToken } from '@angular/core';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BooksPageActions } from '@book-co/books-page/actions';
import {
  BookModel,
  BookSortOrder,
  BookSortProp,
  sortBooks,
} from '@book-co/shared-models';
// import { selectAllBooks } from '@book-co/shared-state-books';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import { adapt } from '@state-adapt/angular';

export interface State {
  sortOrder: BookSortOrder;
  sortProp: BookSortProp;
}
const initialState: State = {
  sortOrder: 'asc',
  sortProp: 'name',
};
const adapter = joinAdapters<State>()({
  sortOrder: createAdapter<BookSortOrder>()({}),
  sortProp: createAdapter<BookSortProp>()({}),
})();

export const BooksListStore = new InjectionToken('BooksListStore', {
  providedIn: 'root',
  factory: () => adapt(['booksList', initialState], adapter),
});
