describe('e2e: Home Page', () => {
  it('should display the trips fetched from the API', () => {
    cy.visit('http://localhost:4200/home');

    cy.get('.trip').should('exist');
  });

  it('should navigate to trip details', () => {
    cy.visit('http://localhost:4200/home');

    cy.get('.trip').should('exist');

    cy.get('.trip').first().click();

    cy.url().should('contain', 'trips/');
  });

  it('should fetch the trip of the day from the API', () => {
    cy.visit('http://localhost:4200/home');

    cy.get('.trip-of-the-day-button').click();

    cy.get('.trip-of-the-day').should('exist');
  });

  it('should fetch the next page from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*page=2/,
    }).as('getPage2');

    cy.visit('http://localhost:4200/home');

    cy.get('.next-page').click();

    cy.wait('@getPage2').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'page=2');
  });

  it('should apply ASC filter and fetch from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*sortOrder=ASC/,
    }).as('getTripsASC');

    cy.visit('http://localhost:4200/home');

    cy.get('.order-button').click();

    cy.wait('@getTripsASC').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'sortOrder=ASC');
  });

  it('should apply 20 limit filter and fetch from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*limit=20/,
    }).as('getTripsLimit20');

    cy.visit('http://localhost:4200/home');

    cy.get('#limit').clear().type('20 {enter}');

    cy.wait('@getTripsLimit20').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'limit=20');
  });

  it('should apply title filter and fetch from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*titleFilter=Trip/,
    }).as('getTripsTitleFilter');

    cy.visit('http://localhost:4200/home');

    cy.get('#title').clear().type('Trip {enter}');

    cy.wait('@getTripsTitleFilter').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'titleFilter=Trip');
  });

  it('should apply sortBy filter and fetch from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*sortBy=price/,
    }).as('getTripsByPrice');

    cy.visit('http://localhost:4200/home');

    cy.get('.dropdown-input').first().trigger('mouseover');
    cy.wait(1000); // We wait a second because the defer is loading
    cy.get('.dropdown-input').first().click();

    cy.get('.dropdown-item span').contains('Price').click();

    cy.wait('@getTripsByPrice').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'sortBy=price');
  });

  it('should apply minRating filter and fetch from the API', () => {
    cy.intercept({
      method: 'GET',
      url: /\/Prod\/v1\/trips\?.*minRating=3/,
    }).as('getTripsByMinRating');

    cy.visit('http://localhost:4200/home');

    cy.get('#minRating').invoke('val', 3).trigger('input').trigger('change');

    cy.wait('@getTripsByMinRating').its('response.statusCode').should('eq', 200);
    cy.url().should('contain', 'minRating=3');
  });
});
