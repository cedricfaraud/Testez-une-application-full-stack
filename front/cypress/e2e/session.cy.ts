describe('Detail Session spec', () => {
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
  it('Shows detail of sessions for admin', () => {
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
    const session = {
      id: 1,
      name: 'Yoga Débutant',
      date: '2024-01-21T11:12:11',
      teacher_id: 1,
      description: 'Yoga pour débutant',
      users: [],
      createdAt: '2024-01-21T11:12:11',
      updatedAt: '2024-01-21T11:12:11',
    };
    const teachers = [
      {
        id: 1,
        lastName: 'Teacher 1',
        firstName: 'Prénom 1',
        createdAt: '2024-01-07 10:00:00',
        updatedAt: '2024-02-08 10:00:00',
      },
      {
        id: 2,
        lastName: 'Teacher 2',
        firstName: 'Prénom 2',
        createdAt: '2024-01-07 10:00:00',
        updatedAt: '2024-02-08 10:00:00',
      },
    ];

    const teacher = teachers.find((teacher) => teacher.id == 1);
    cy.intercept('GET', '/api/teacher/1', teacher);

    cy.contains('Rentals available').should('be.visible');
    cy.intercept('GET', '/api/session/1', { body: session });
    cy.intercept('GET', '/api/session/2', { body: session });

    cy.contains('button', 'Detail').first().click();
    cy.contains('delete').should('be.visible');
    cy.contains('Yoga pour débutant').should('be.visible');
  });

  it('Shows detail of sessions for user', () => {
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

    const session = {
      id: 1,
      name: 'Yoga Débutant',
      date: '2024-01-21T11:12:11',
      teacher_id: 1,
      description: 'Yoga pour débutant',
      users: [],
      createdAt: '2024-01-21T11:12:11',
      updatedAt: '2024-01-21T11:12:11',
    };

    const teachers = [
      {
        id: 1,
        lastName: 'Teacher 1',
        firstName: 'Prénom 1',
        createdAt: '2024-01-07 10:00:00',
        updatedAt: '2024-02-08 10:00:00',
      },
      {
        id: 2,
        lastName: 'Teacher 2',
        firstName: 'Prénom 2',
        createdAt: '2024-01-07 10:00:00',
        updatedAt: '2024-02-08 10:00:00',
      },
    ];

    const teacher = teachers.find((teacher) => teacher.id == 1);
    cy.intercept('GET', '/api/teacher/1', teacher);

    cy.contains('Rentals available').should('be.visible');
    cy.intercept('GET', '/api/session/1', { body: session });
    cy.intercept('GET', '/api/session/2', { body: session });

    cy.contains('button', 'Detail').first().click();
    cy.contains('delete').should('not.exist');
    cy.contains('Participate').should('be.visible');
    cy.contains('Yoga pour débutant').should('be.visible');
  });
});
