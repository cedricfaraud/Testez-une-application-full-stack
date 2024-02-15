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
describe('Delete Session spec', () => {
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
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  it('Shows list of sessions for admin', () => {
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
    cy.contains('Rentals available').should('be.visible');
    cy.intercept('GET', '/api/session/1', { body: session });
    cy.intercept('DELETE', '/api/session/1', session);

    cy.contains('button', 'Detail').first().click();
    cy.contains('button', 'Delete').click();
    cy.get('.mat-simple-snackbar').should('contain', 'Session deleted !');
  });
});
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
