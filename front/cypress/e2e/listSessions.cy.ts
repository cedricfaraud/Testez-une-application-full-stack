describe('List spec', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          lastName: 'FARAUD',
          firstName: 'CEDRIC',
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
        {
          id: 2,
          lastName: 'MARTIN',
          firstName: 'MONIQUE',
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
      ],
    }).as('teacher');
    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          lastName: 'FARAUD',
          firstName: 'CEDRIC',
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
      ],
    }).as('teacher');

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Yoga Débutant',
          date: '2024-01-21T11:12:11',
          teacher_id: 1,
          description: 'Yoga pour débutant',
          users: [],
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
        {
          id: 2,
          name: 'Yoga confirmé',
          date: '2024-01-21T11:12:11',
          teacher_id: 2,
          description: 'Yoga pour confirmé',
          users: [],
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
      ],
    }).as('sessions');
  });
  it('Shows list of sessions for admin', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'Admin',
        admin: true,
      },
    });
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.contains('Create').should('be.visible');
    cy.contains('Rentals available').should('be.visible');
    cy.get('.item').each(($el) => {
      cy.wrap($el).find('button').contains('edit').should('be.visible');
      cy.wrap($el).find('button').contains('Detail').should('be.visible');
    });
  });

  it('Shows list of sessions for user', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'Admin',
        admin: false,
      },
    });
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.contains('Create').should('not.exist');
    cy.contains('Rentals available').should('be.visible');
    cy.get('.item').each(($el) => {
      cy.wrap($el).find('button').contains('edit').should('not.exist');
      cy.wrap($el).find('button').contains('Detail').should('be.visible');
    });
  });
});
