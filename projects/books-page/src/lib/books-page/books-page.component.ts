import { Component, inject } from '@angular/core';
import { BooksPageActions } from '@book-co/books-page/actions';
import { BooksStore } from '@book-co/shared-state-books';

@Component({
  selector: 'bco-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss'],
})
export class BooksPageComponent {
  store = inject(BooksStore);

  isLoading$ = this.store.isLoading$;
  error$ = this.store.error$;
  books$ = this.store.booksAll$;
  currentBook$ = this.store.activeBook$;
  total$ = this.store.earningsTotals$;

  delete$ = BooksPageActions.deleteBook$;
  save$ = BooksPageActions.saveBook$;
}
