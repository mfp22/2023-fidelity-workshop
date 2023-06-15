describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  afterEach(() => {
    localStorage.removeItem('auth');
  });

  const getPage = () => cy.get('bco-login-page');
  const findId = (selector: string, modifier: '^' | '$' | '' = '') =>
    getPage().find(`[data-test-id${modifier}="${selector}"]`);

  it('should let you login', () => {
    findId('usernameInput').type('testuser');
    findId('passwordInput').type('password');
    findId('loginButton').click();

    cy.window().its('localStorage').invoke('getItem', 'auth').should('exist');
  });

  it('should show an error if you enter an invalid username or password', () => {
    findId('usernameInput').type('testuser');
    findId('passwordInput').type('wrongpassword');
    findId('loginButton').click();

    getPage().contains('Error: Invalid username or password');
  });
});
