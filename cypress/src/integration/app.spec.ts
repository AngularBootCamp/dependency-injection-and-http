export const app =
  'Step: ' +
  Cypress.config()
    .integrationFolder.split('\\')
    .find(pathSegment => /[0-9]/.test(pathSegment));

describe(app, () => {
  // in this example we will stub the http response from /api/employees,
  // this is not really necessary for this example but it can
  // be useful if the real server is not available yet, it is
  // also useful to easily get to specific edge cases and for
  // setting delays
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the real employees', () => {
    cy.get('.collection-item').should('have.length', 100);
    cy.contains('Henry Holmes');
  });

  it('should load the stubbed employees, checking for loading indicator', () => {
    cy.server();
    cy.route({
      url: '/api/employees',
      response: [
        {
          email: 'hholmes0@goodreads.com',
          firstName: 'Henry',
          hourlyWage: 19,
          hoursWorked: 29,
          id: 1,
          lastName: 'Holmes'
        },
        {
          email: 'hcox1@who.int',
          firstName: 'Harold',
          hourlyWage: 11,
          hoursWorked: 18,
          id: 2,
          lastName: 'Cox'
        }
      ]
    }).as('getEmployees');
    cy.visit('/');

    cy.wait('@getEmployees');
    cy.get('.collection-item').should('have.length', 2);
    cy.contains('Henry Holmes');
  });

  it('should handle not being able to get any employees', () => {
    cy.server();
    cy.route({
      url: '/api/employees',
      response: []
    }).as('getEmployees');
    cy.get('.collection-item').should('not.exist');
  });
});
