import {Routes} from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/dashboards-home/dashboards-home.component').then(
        (m) => m.N3cDashboardsHomeComponent
      )
  },
  {
    path: 'pprl',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/pprl-dashboard/pprl-dashboard.component').then(
        (m) => m.PprlDashboardComponent
      )
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      )
  },
  {
    path: 'publications',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/publications/publications.component').then(
        (m) => m.N3cPublicationsComponent
      )
  },
  {
    path: 'collaboration-graph',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/collaboration-networks/collaboration-networks.component').then(
        (m) => m.CollaborationNetworksComponent
      )
  },
  {
    path: 'downloads',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/data-download/data-download.component').then(
        (m) => m.DataDownloadComponent
      )
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/teams-dashboard/teams-dashboard.component').then(
        (m) => m.TeamsDashboardComponent
      )
  },
  {
    path: 'pprl-enrichment',
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import(
            '@odp/n3c/lib/components/dashboards/pprl-enrichment/pprl-enrichment-home/pprl-enrichment-home.component'
          ).then((m) => m.PprlEnrichmentHomeComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/pprl-enrichment/pprl-enrichment.component').then(
            (m) => m.PprlEnrichmentComponent
          )
      }
    ]
  },
  {
    path: 'collaborating-sites',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/collaboration-profiles/collaboration-profiles.component').then(
            (m) => m.CollaborationProfilesComponent
          )
      },
      {
        path: ':siteId',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/site-profile/site-profile.component').then(
            (m) => m.SiteProfileComponent
          )
      }
    ]
  },
  {
    path: 'collaboration-map',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/collaboration-map/collaboration-map.component').then(
        (m) => m.CollaborationMapComponent
      )
  },
  {
    path: 'publications-map',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/publications-map/publications-map.component').then(
        (m) => m.PublicationsMapComponent
      )
  },
  {
    path: 'contributing-sites',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/contributing-sites/contributing-sites.component').then(
        (m) => m.ContributingSitesComponent
      )
  },
  {
    path: 'hss',
    children: [
      {
        path: '',
        redirectTo: 'participant_info',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/demographics-table/demographics-table.component').then(
            (m) => m.N3cDemTableComponent
          )
      }
    ]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/site-user-metrics/site-user-metrics.component').then(
        (m) => m.SiteUserMetricsComponent
      )
  },
  {
    path: 'concept-sets',
    loadComponent: () =>
      import('@odp/n3c/lib/components/dashboards/concept-sets/concept-sets.component').then(
        (m) => m.ConceptSetsComponent
      )
  },
  {
    path: 'enclave-health',
    children: [
      {
        path: '',
        redirectTo: 'comorbidities',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/enclave-health/enclave-health.component').then(
            (m) => m.EnclaveHealthComponent
          )
      }
    ]
  },
  {
    path: 'timeline',
    children: [
      {
        path: '',
        redirectTo: 'daily',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/covid-cases/covid-cases.component').then(
            (m) => m.CovidCasesComponent
          )
      }
    ]
  },
  {
    path: 'disease-snapshots',
    children: [
      {
        path: '',
        redirectTo: 'cancer',
        pathMatch: 'full'
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/disease-snapshots/disease-snapshots.component').then(
            (m) => m.DiseaseSnapshotsComponent
          )
      }
    ]
  }
];
