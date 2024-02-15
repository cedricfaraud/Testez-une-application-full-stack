describe('Update Session spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('login');

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
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  it('update sessions for admin', () => {
    const session = {
      id: 1,
      name: 'Update test',
      date: '2024-01-21T11:12:11',
      teacher_id: 1,
      description: 'On se repose ici',
      users: [],
      createdAt: '2024-01-21T11:12:11',
      updatedAt: '2024-01-21T11:12:11',
    };
    cy.intercept('GET', '/api/teacher/1', '@teacher');

    cy.intercept('PUT', '/api/session/1', {
      body: session,
    }).as('sessionUpdated');
    cy.intercept('GET', '/api/session/1', session);
    cy.intercept('GET', '/api/session/2', session);
    cy.contains('button', 'Edit').first().click();
    cy.get('textarea[formControlName=description]').clear().type('Update test');
    cy.contains('button', 'Save').click();
    cy.wait('@sessionUpdated');
    cy.get('.mat-simple-snackbar').should('contain', 'Session updated !');
  });
  it('update sessions not complete with submit button disabled', () => {
    const session = {
      id: 1,
      name: 'Update test',
      date: '2024-01-21T11:12:11',
      teacher_id: 1,
      description: 'Update test',
      users: [],
      createdAt: '2024-01-21T11:12:11',
      updatedAt: '2024-01-21T11:12:11',
    };
    cy.intercept('GET', '/api/teacher/1', '@teacher');

    cy.intercept('PUT', '/api/session/1', {
      body: session,
    }).as('sessionUpdated');
    cy.intercept('GET', '/api/session', {
      body: session,
    });
    cy.intercept('GET', '/api/session/1', session);
    cy.intercept('GET', '/api/session/2', session);
    cy.contains('button', 'Edit').first().click();
    cy.get('input[formControlName=date]').clear();
    cy.get('button[type=submit]').should('be.disabled');
  });
});
