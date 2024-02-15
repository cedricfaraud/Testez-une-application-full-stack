describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('Logout Successfull', () => {
    cy.contains('Logout').click();

    cy.url().should('include', '/');
    cy.get('span[routerLink="login"]').contains('Login');
    cy.get('span[routerLink="register"]').contains('Register');
  });

  it('Login fail', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('loginfail@email.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('.error').should('contain', 'An error occurred');
  });
  it('password fail', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'bad-password'}{enter}{enter}`
    );
    cy.get('.error').should('contain', 'An error occurred');
  });
  it('password missing', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type(
      `${'yoga@studio.com'}{enter}{enter}`
    );
    cy.get('.error').should('contain', 'An error occurred');
  });

  it('Login missing', () => {
    cy.visit('/login');

    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('.error').should('contain', 'An error occurred');
  });
});
