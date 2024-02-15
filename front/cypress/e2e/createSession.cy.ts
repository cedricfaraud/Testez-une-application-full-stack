describe('Create session spec', () => {
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
    }).as('session');
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
        {
          id: 3,
          name: 'Yoga intermédiaire',
          date: '2024-01-21T11:12:11',
          teacher_id: 1,
          description: 'Yoga pour intermédiaire',
          users: [],
          createdAt: '2024-01-21T11:12:11',
          updatedAt: '2024-01-21T11:12:11',
        },
      ],
    }).as('sessionCreated');

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
    cy.intercept('POST', '/api/session', {
      body: {
        id: 5,
        name: 'Yoga intermédiaire',
        date: '2024-01-21T11:12:11',
        teacher_id: 1,
        description: 'Yoga pour intermédiaire',
        users: [],
        createdAt: '2024-01-21T11:12:11',
        updatedAt: '2024-01-21T11:12:11',
      },
    }).as('createSession');
  });

  it('Create session intermediaire', () => {
    cy.visit('/sessions/create');
    cy.get('@login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('@session');

    cy.contains('Create').click();
    cy.get('@teacher');
    cy.url().should('include', '/sessions/create');
    cy.get('input[formControlName=name]').type('Yoga intermédiaire');
    cy.get('input[formControlName=date]').type('2024-01-21');
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('CEDRIC FARAUD')
      .click();
    cy.get('textarea[formControlName=description]').type(
      'Yoga doux pour intermédiaire'
    );
    cy.get('button[type=submit]').click();

    cy.get('@sessionCreated');
    cy.get('button[routerLink="create"]').should('contain', 'Create');
    cy.url().should('include', '/sessions');
  });

  it('Create session intermediaire not complete with submit button disabled', () => {
    cy.visit('/sessions/create');
    cy.get('@login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('@session');

    cy.contains('Create').click();
    cy.get('@teacher');

    cy.url().should('include', '/sessions/create');
    cy.get('input[formControlName=name]').type('Yoga intermédiaire');
    cy.get('input[formControlName=date]').clear();
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('CEDRIC FARAUD')
      .click();
    cy.get('textarea[formControlName=description]').type(
      `${'Yoga doux pour intermédiaire'}{enter}{enter}`
    );

    cy.get('button[type=submit]').should('be.disabled');
  });
});
