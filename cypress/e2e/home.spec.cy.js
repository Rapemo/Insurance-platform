describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the welcome message', () => {
    cy.get('h1').should('contain', 'Welcome');
  });

  it('should have a navigation menu with all links', () => {
    cy.get('nav').should('be.visible');
    
    // Check navigation links
    cy.get('nav a').should('have.length', 5); // Adjust based on actual number of links
    cy.get('nav').contains('Dashboard');
    cy.get('nav').contains('Claims');
    cy.get('nav').contains('Quote');
  });

  it('should handle authentication flow', () => {
    // Start with login button visible
    cy.get('button').contains('Login').should('be.visible');

    // Click login
    cy.get('button').contains('Login').click();

    // Verify logout button appears
    cy.get('button').contains('Logout').should('be.visible');

    // Click logout
    cy.get('button').contains('Logout').click();

    // Verify back to login
    cy.get('button').contains('Login').should('be.visible');
  });

  it('should handle form submission', () => {
    // Fill out form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    // Verify success message
    cy.get('.success-message').should('be.visible');
  });

  it('should handle error states', () => {
    // Simulate error
    cy.intercept('GET', '/api/data', {
      statusCode: 500,
      body: { error: 'An error occurred' }
    });

    // Verify error message
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'An error occurred');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
});
