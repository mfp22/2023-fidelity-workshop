import { BookModel, calculateBooksGrossEarnings } from '@book-co/shared-models';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import {
  EntityState,
  booleanAdapter,
  createEntityAdapter,
} from '@state-adapt/core/adapters';

export interface State {
  activeBookId: string | null;
  isLoading: boolean;
  error: object | null;
  books: EntityState<BookModel>;
}

const bookAdapter = joinAdapters<BookModel, keyof BookModel>()({})();
const booksAdapter = createEntityAdapter<BookModel>()(bookAdapter);

const errorAdapter = createAdapter<object | null>()({});
const activeBookIdAdapter = createAdapter<string | null>()({
  setNull: () => null,
});

export const adapter = joinAdapters<State>()({
  activeBookId: activeBookIdAdapter,
  isLoading: booleanAdapter,
  error: errorAdapter,
  books: booksAdapter,
})({
  activeBook: (s) => {
    if (s.activeBookId) return s.booksEntities[s.activeBookId] ?? null;

    return null;
  },
  earningsTotals: (s) => calculateBooksGrossEarnings(s.booksAll),
})({
  receiveBooks: {
    isLoading: booleanAdapter.setFalse,
    books: booksAdapter.setAll,
  },
  receiveError: {
    isLoading: booleanAdapter.setFalse,
    error: errorAdapter.set,
  },
  addBook: {
    activeBookId: activeBookIdAdapter.setNull,
    books: booksAdapter.addOne,
  },
  updateBook: {
    activeBookId: activeBookIdAdapter.setNull,
    books: booksAdapter.updateOne,
  },
})();
