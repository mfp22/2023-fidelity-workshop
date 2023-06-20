import { BookModel, calculateBooksGrossEarnings } from '@book-co/shared-models';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import {
  booleanAdapter,
  createEntityAdapter,
  EntityState,
} from '@state-adapt/core/adapters';

export interface State {
  activeBookId: string | null;
  isLoading: boolean;
  error: object | null;
  books: EntityState<BookModel>; // https://github.com/state-adapt/state-adapt/blob/main/libs/core/adapters/src/lib/create-entity-adapter.function.ts#LL17C1-L23C2
}

const bookAdapter = joinAdapters<BookModel, keyof BookModel>()({})(); // https://state-adapt.github.io/docs/core#joinadapters
const booksAdapter = createEntityAdapter<BookModel>()(bookAdapter); // https://state-adapt.github.io/adapters/core#createEntityAdapter

const errorAdapter = createAdapter<object | null>()({}); // https://state-adapt.github.io/docs/core#createadapter
// https://state-adapt.github.io/docs/core#createadapter
const activeBookIdAdapter = createAdapter<string | null>()({
  setNull: () => null,
});

// https://state-adapt.github.io/docs/core#joinadapters
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
