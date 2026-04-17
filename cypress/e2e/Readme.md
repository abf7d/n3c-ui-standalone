BEFORE trying to run Cypress tests, you need to do the following:

- Make sure you are connected to the VPN

- Make sure you have the API-PYTHON backend running in your LOCAL

- Make sure you have to have the Angular UI running on your LOCAL at: localhost:4200

To run the Cypress tests, use this command for a headless test:

    npx cypress run --spec "cypress/e2e/n3c-page-load.cy.ts"

To run Cypress and see it running the tests with more detailed logging:

    npx cypress open

Then select E2E testing, then select the Chrome and then the n3c-page-load.cy.ts file to run.
