import { BookModel } from '@book-co/shared-models';
import * as uuid from 'uuid';

describe('Books Page', () => {
  let book: BookModel;

  beforeEach(() => {
    book = {
      id: uuid.v4(),
      name: 'The Lord of the Rings',
      earnings: '100',
      description:
        'The Lord of the Rings is an epic high fantasy novel written by English author and scholar J. R. R. Tolkien.',
    };

    // It's not a real login feature
    const user = { id: uuid.v4(), username: 'testuser' };
    localStorage.setItem('auth', JSON.stringify(user));

    cy.visit('/books');
  });

  afterEach(() => {
    localStorage.removeItem('auth');
    // write back original db.json
    cy.exec('git checkout ../../db.json');
  });

  const findId = (selector: string, modifier: '^' | '$' | '' = '') =>
    cy.get('bco-books-page').find(`[data-test-id${modifier}="${selector}"]`);

  const getBookList = () => findId('book-', '^');

  it('should let you perform CRUD operations on books ', () => {
    getBookList().should('have.length', 2);

    // Create
    findId('nameInput').type(book.name);
    findId('earningsInput').type(book.earnings);
    findId('descriptionInput').type(book.description!);

    findId('saveButton').click();
    getBookList().should('have.length', 3).contains(book.name);

    // Read
    getBookList()
      .contains(book.name)
      .parent()
      .find('[data-test-id="bookEditButton"]')
      .click();
    findId('nameInput').should('have.value', book.name);
    findId('cancelButton').click();
    findId('nameInput').should('have.value', '');

    // Update
    getBookList()
      .contains(book.name)
      .parent()
      .find('[data-test-id="bookEditButton"]')
      .click();
    findId('nameInput').type(' Updated');
    findId('saveButton').click();
    getBookList().contains(book.name + ' Updated');

    // Delete
    getBookList()
      .contains(book.name + ' Updated')
      .parent()
      .find('[data-test-id="bookDeleteButton"]')
      .click();
    getBookList().should('have.length', 2);
  });

  it('should gracefully show an error message when loading the books fails', () => {
    cy.intercept('http://localhost:3000/books', { forceNetworkError: true }).as(
      'failed'
    );
    cy.wait('@failed');
    cy.get('bco-books-page').contains(
      'An unexpected error occurred. Please try again.'
    );
  });
});
