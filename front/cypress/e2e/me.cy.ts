describe('Account spec', () => {
  it('Verify Account infos', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        email: 'yoga@studio.com',
        lastName: 'Yoga',
        firstName: 'Studio',
        admin: true,
        createdAt: '2024-02-06 10:00:00',
        updatedAt: '2024-02-08 10:00:00',
      },
    }).as('user');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('@user');
    cy.contains('Account').click();
    cy.contains('User information').should('be.visible');
    cy.contains('Name: Studio YOGA').should('be.visible');
    cy.contains('Email: yoga@studio.com').should('be.visible');
    cy.contains('You are admin').should('be.visible');
  });
});
