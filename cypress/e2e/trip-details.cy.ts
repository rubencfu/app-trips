describe('e2e: Trip Details Page', () => {
  it('should display the trip details fetched from the API', () => {
    // We can configure env variables for this kind of data
    cy.visit('http://localhost:4200/trips/51c25069-ecaf-4657-8e4e-9a56ff2d08cd'); // Real trip from API: Trip to Tokyo

    cy.get('.trip-name h1').contains('Trip to Kyoto');

    cy.get('img[alt="trip image"]').should('have.attr', 'src').and('not.be.empty');

    cy.get('.price').should('not.be.empty');

    cy.get('app-star-rating').should('exist');

    cy.get('.score-badge').contains('Good');

    cy.get('.trip-other').within(() => {
      cy.contains('CO2:').should('not.be.empty');
      cy.contains('Created:').should('not.be.empty');
      cy.contains('Vertical Type:').should('not.be.empty');
      cy.contains('Tags:').should('not.be.empty');
    });
  });

  it('should redirects to home if trip not found', () => {
    cy.visit('http://localhost:4200/trips/invalid-id');

    cy.url().should('contain', 'http://localhost:4200/home');
  });
});
