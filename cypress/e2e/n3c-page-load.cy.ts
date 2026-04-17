describe('template spec', () => {
  it('Admin Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/map_data').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/ochin_locations').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/site_locations').as('endpoint3');
    cy.intercept('GET', '**/n3c/dashboard/line_dua_dta_regs').as('endpoint4');
    cy.intercept('GET', '**/n3c/dashboard/domain_team_roster').as('endpoint5');
    cy.intercept('GET', '**/n3c/dashboard/project_roster').as('endpoint6');
    cy.intercept('GET', '**/n3c/dashboard/admin_institutions').as('endpoint8');
    cy.intercept('GET', '**/n3c/dashboard/admin_users').as('endpoint9');
    cy.intercept('GET', '**/n3c/current_release').as('endpoint10');
    cy.intercept('GET', '**/n3c/current_notes').as('endpoint11');

    cy.visit('/dashboard/admin');
    cy.wait([
      '@endpoint1',
      '@endpoint2',
      '@endpoint3',
      '@endpoint4',
      '@endpoint5',
      '@endpoint6',
      '@endpoint8',
      '@endpoint9',
      '@endpoint10',
      '@endpoint11',
    ]);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');

    cy.get('.error-msg').should('not.exist');
    cy.get('.map svg').should('exist').and('be.visible');

    cy.get('.institutions-chart svg').should('exist').and('be.visible');
  });

  it('Collaboration Graph Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/project_organization_graph').as('endpoint1');
    cy.visit('/dashboard/collaboration-graph');
    cy.wait(['@endpoint1']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');

    cy.get('.collab-chart svg').should('exist').and('be.visible');
    cy.get('.legend').should('exist').and('be.visible');
  });

  it('Download Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/download_detail').as('endpoint1');
    cy.visit('/dashboard/downloads');
    cy.wait(['@endpoint1']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('N3C Teams Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/domain_team_roster').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/project_roster').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/publications').as('endpoint3');
    cy.visit('/dashboard/teams');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/pprl-enrichment/home
  it('PPRL Home Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/pprl/summary/medicare').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/pprl/summary/medicaid').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/pprl/summary/mortality').as('endpoint3');
    cy.intercept('GET', '**/n3c/dashboard/pprl/summary/viral').as('endpoint4');
    cy.intercept('GET', '**/n3c/dashboard/pprl/total_counts').as('endpoint5');
    cy.visit('/dashboard/pprl-enrichment/home');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3', '@endpoint4', '@endpoint5']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/pprl-enrichment/medicare_demo
  it('PPRL Enrichment Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/pprl/demographics/medicare').as('endpoint1');
    cy.intercept('GET', '**/n3c/current_release').as('endpoint2');
    cy.visit('/dashboard/pprl-enrichment/medicare_demo');
    cy.wait(['@endpoint1', '@endpoint2']);
    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/contributing-sites
  it('Contributing Sites: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/map_data').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/ochin_locations').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/site_locations').as('endpoint3');
    cy.intercept('GET', '**/n3c/rest/n3c_alexis/census_county').as('endpoint4');
    // cy.intercept('GET', '**/n3c/dashboard/pprl/total_counts').as('endpoint5');
    cy.visit('/dashboard/contributing-sites');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3', '@endpoint4']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });
  // http://localhost:4200/dashboard/hss/participant_info
  it('Demographics Table for IRB Submission: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/irb/demographics').as('endpoint1');
    cy.intercept('GET', '**/n3c/current_release').as('endpoint2');
    cy.visit('/dashboard/hss/participant_info');
    cy.wait(['@endpoint1', '@endpoint2']);
    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/collaborating-sites
  it('Collaborating Sites: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/site_collaborations').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/site_collaboration_edges').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/site_locations').as('endpoint3');
    cy.visit('/dashboard/collaborating-sites');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/collaborating-sites/MDUxZmQ5NjY2
  // http://localhost:4200/dashboard/collaboration-map
  it('Collaboration Map: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/site_collaborations').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/site_collaboration_edges').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/site_collaboration_legend').as('endpoint3');
    cy.visit('/dashboard/collaboration-map');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/publications-map
  it('Publications Map: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/site_publications').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/site_publication_edges').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/site_publication_summary').as('endpoint3');
    cy.visit('/dashboard/publications-map');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/users
  it('Users: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/line_dua_dta_regs').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/admin_institutions').as('endpoint2');
    cy.intercept('GET', '**/n3c/dashboard/admin_users').as('endpoint3');
    cy.visit('/dashboard/users');
    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/concept-sets
  it('Concept Sets: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/zenodo').as('endpoint1');
    cy.visit('/dashboard/concept-sets');
    cy.wait(['@endpoint1']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/enclave-health/comorbidities
  it('Enclave Health: should not have error message', () => {
    cy.intercept('GET', '**/n3c/current_release').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/public-health/all_comorbidities').as('endpoint2');
    cy.visit('/dashboard/enclave-health/comorbidities');
    cy.wait(['@endpoint1', '@endpoint2']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/timeline/daily
  it('Cumulative and Average COVID+ Cases: should not have error message', () => {
    cy.intercept('GET', '**/n3c/current_release').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/public-health/timeline').as('endpoint2');
    cy.visit('/dashboard/timeline/daily');
    cy.wait(['@endpoint1', '@endpoint2']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  // http://localhost:4200/dashboard/disease-snapshots/cancer
  it('Disease Snapshots Cancer: should not have error message', () => {
    cy.intercept('GET', '**/n3c/current_release').as('endpoint1');
    cy.intercept('GET', '**/n3c/dashboard/public-health/disease/cancer').as('endpoint2');
    cy.visit('/dashboard/disease-snapshots/cancer');
    cy.wait(['@endpoint1', '@endpoint2']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Publications Dashboard: should not have error message', () => {
    cy.intercept('GET', '**/n3c/dashboard/publications').as('endpoint1');
    cy.visit('/dashboard/publications');
    cy.wait(['@endpoint1']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Clinical Cohort: should not have error message', () => {
    const endpoint1 = '**/api/tenant-profiles/2**';
    const endpoint2 = '**/api/tenant-profiles/3**';
    const endpoint3 = '**/api/tenant-profiles/4**';
    const endpoint4 = '**/api/tenant-profiles/5**';
    const endpoint5 = '**/api/tenant-profiles/6**';

    cy.intercept('GET', endpoint1).as('endpoint1');
    cy.intercept('GET', endpoint2).as('endpoint2');
    cy.intercept('GET', endpoint3).as('endpoint3');
    cy.intercept('GET', endpoint4).as('endpoint4');
    cy.intercept('GET', endpoint5).as('endpoint5');

    cy.visit('/clinical-cohort');

    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3', '@endpoint4', '@endpoint5']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Covid: should not have error message', () => {
    const endpoint1 = '**/n3c/dashboard/embedded_enclave_metrics';
    const endpoint2 = '**/n3c/dashboard/embedded_people_metrics';

    cy.intercept('GET', endpoint1).as('endpoint1');
    cy.intercept('GET', endpoint2).as('endpoint2');
    cy.intercept('GET', '**/api/tenant-profiles/2**').as('endpoint3');
    cy.intercept('GET', '**/api/landing-page**').as('endpoint4');

    cy.visit('/covid');

    cy.wait(['@endpoint1', '@endpoint2', '@endpoint3', '@endpoint4']);

    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Education: should not have error message', () => {
    cy.intercept('GET', '**/api/tenant-profiles/3**').as('endpoint1');
    cy.visit('/education');
    cy.wait(['@endpoint1']);
    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Cancer: should not have error message', () => {
    cy.intercept('GET', '**/api/tenant-profiles/4**').as('endpoint1');
    cy.visit('/cancer');
    cy.wait(['@endpoint1']);
    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });

  it('Renal: should not have error message', () => {
    cy.intercept('GET', '**/api/tenant-profiles/5**').as('endpoint1');
    cy.visit('/renal');
    cy.wait(['@endpoint1']);
    cy.get('.loading-message', { timeout: 10000 }).should('not.exist');
    cy.get('.error-msg').should('not.exist');
  });
});
