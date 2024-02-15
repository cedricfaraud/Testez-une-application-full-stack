describe('Register spec', () => {
  it('Register successful', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });

    cy.get('input[formControlName=email]').type('registerTest@studio.com');
    cy.get('input[formControlName=firstName]').type('Cedric');
    cy.get('input[formControlName=lastName]').type('Faraud');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.url().should('include', '/login');
  });

  it('Invalid/Empty Last name', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });
    cy.get('input[formControlName=email]').type('registerTest@studio.com');
    cy.get('input[formControlName=firstName]').type('Cedric');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('Invalid/Empty Password', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });
    cy.get('input[formControlName=email]').type('registerTest@studio.com');
    cy.get('input[formControlName=firstName]').type('Cedric');
    cy.get('input[formControlName=lastName]').type('Faraud');
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('Invalid/Empty Email', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {},
    });
    cy.get('input[formControlName=firstName]').type('Faraud');
    cy.get('input[formControlName=lastName]').type('Cedric');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('button[type=submit]').should('be.disabled');
  });
});
