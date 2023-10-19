import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BookModel } from '@book-co/shared-models';
import { BooksListStateService } from './books-list.store';

@Component({
  selector: 'bco-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
})
export class BooksListComponent {
  @Input() books: BookModel[] | null = [];
  @Output() select = new EventEmitter();
  @Output() delete = new EventEmitter();
  store = inject(BooksListStateService).store;
}
