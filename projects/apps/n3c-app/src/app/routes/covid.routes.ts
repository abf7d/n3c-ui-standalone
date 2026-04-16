import {Routes} from '@angular/router';

export const COVID_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/covid-home/covid-home.component').then((m) => m.N3cCovidHomeComponent)
  },
  {
    path: 'contributors',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'contributor',
      contentProp: 'block1',
      title: 'Contributors'
    }
  },
  {
    path: 'faq',
    loadComponent: () => import('@odp/n3c/lib/components/enclave/faq/faq.component').then((m) => m.N3cFaqPageComponent)
  },
  {
    path: 'agreements',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/agreements/agreements.component').then((m) => m.N3cAgreementsComponent)
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/projects/projects.component').then((m) => m.N3cProjectsPageComponent)
  },
  {
    path: 'training',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/training/training.component').then((m) => m.N3cTrainingPageComponent)
  },
  {
    path: 'fact-sheet',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/fact-sheet/fact-sheet.component').then((m) => m.N3cFactSheetComponent)
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/calendar/calendar.component').then((m) => m.N3cCalendarComponent)
  },
  {
    path: 'policy',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/policy/policy.component').then((m) => m.N3cPolicyComponent)
  },
  {
    path: 'tools',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/tools/tools.component').then((m) => m.N3cToolsComponent)
  },
  {
    path: 'communications',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/communications/communications.component').then(
        (m) => m.N3cCommunicationsComponent
      )
  },
  {
    path: 'acknowledgements',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/acknowledgements/acknowledgements.component').then(
        (m) => m.N3cAcknowledgementsComponent
      )
  },
  {
    path: 'covid-extension',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'covid-extension',
      showHeader: true,
      title: 'COVID Agreement Extensions',
      headerProp: 'title',
      contentProp: 'text_block1'
    }
  },
  {
    path: 'external-datasets',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/external-datasets/external-datasets.component').then(
        (m) => m.ExternalDatasetsComponent
      )
  },
  {
    path: 'mission',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/mission/mission.component').then((m) => m.N3cMissionComponent)
  },
  {
    path: 'presentations',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/presentations/presentations.component').then(
        (m) => m.N3cPresentationsPageComponent
      )
  },
  {
    path: 'forum',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'forum',
      contentProp: 'block1',
      headerProp: 'Header'
    }
  },
  {
    path: 'support',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'support'
    }
  },
  {
    path: 'institution-essentials',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/institution-essentials/institution-essentials.component').then(
        (m) => m.N3cInstitutionEssentialsComponent
      )
  },
  {
    path: 'download',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/download/download.component').then((m) => m.N3cDownloadComponent)
  },
  {
    path: 'researcher-essentials',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/researcher-essentials/researcher-essentials.component').then(
        (m) => m.N3cResearcherEssentialsComponent
      )
  },
  {
    path: 'dur',
    loadComponent: () => import('@odp/n3c/lib/components/enclave/dur/dur.component').then((m) => m.N3cDurComponent)
  },
  {
    path: 'account-creation',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/enclave-account-creation/enclave-account-creation.component').then(
        (m) => m.N3cEnclaveAccountCreationComponent
      )
  },
  {
    path: 'onboarding',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/onboarding/onboarding.component').then(
            (m) => m.N3cOnboardingComponent
          )
      },
      {
        path: 'registration',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@odp/n3c/lib/components/enclave/registration/registration.component').then(
                (m) => m.N3cRegistrationComponent
              )
          },
          {
            path: 'authenticate',
            loadComponent: () =>
              import('@odp/n3c/lib/components/enclave/authenticate/authenticate.component').then(
                (m) => m.N3cAuthenticateComponent
              )
          }
        ]
      }
    ]
  },
  {
    path: 'liaisons',
    data: {
      strapiEndpoint: 'liaison'
    },
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent)
  },
  {
    path: 'domain-teams',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/domain-teams/domain-teams.component').then(
            (m) => m.N3cDomainTeamsComponent
          )
      },
      {
        path: ':type/:domain',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/domain/domain.component').then((m) => m.N3cDomainComponent)
      },
      {
        path: 'team-creation',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/team-creation/team-creation.component').then(
            (m) => m.N3cTeamCreationComponent
          )
      }
    ]
  },
  {
    path: 'pprl',
    loadComponent: () => import('@odp/n3c/lib/components/enclave/pprl/pprl.component').then((m) => m.N3cPprlComponent)
  },
  {
    path: 'publication-review',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/publication-review/publication-review.component').then(
        (m) => m.N3cPublicationReviewComponent
      )
  },
  {
    path: 'press-coverage',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/press-coverage/press-coverage.component').then(
        (m) => m.N3cPressCoverageComponent
      )
  },
  {
    path: 'covid-about',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/covid-about/covid-about.component').then((m) => m.N3cCovidAboutComponent)
  },
  {
    path: 'phastr',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/phastr/phastr.component').then((m) => m.N3cPhastrComponent)
  },
  {
    path: 'enclave-essentials',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/enclave-essentials/enclave-essentials.component').then(
        (m) => m.N3cEnclaveEssentialsComponent
      )
  }
];
