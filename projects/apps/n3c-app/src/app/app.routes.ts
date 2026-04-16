import {Routes} from '@angular/router';
import {siteStatusGuard} from '@odp/shared/lib/guards/site-status.guard';
import {COVID_ROUTES} from './routes/covid.routes';
import {EDUCATION_ROUTES} from './routes/education.routes';
import {DASHBOARD_ROUTES} from './routes/dashboard.routes';
import {CANCER_ROUTES} from './routes/cancer.routes';
import {RENAL_ROUTES} from './routes/renal.routes';
import {CLINICAL_COHORT_ROUTES} from './routes/clinical-cohort.routes';

export const statusRoutes: Routes = [];

export const n3cRoutes: Routes = [
  {
    path: '',
    canActivate: [siteStatusGuard],
    children: [
      {path: '', redirectTo: '/clinical-cohort', pathMatch: 'full'},
      {
        path: 'outage',
        loadComponent: () => import('@odp/shared/lib/outage/outage.component').then((m) => m.OutageComponent)
      },
      {path: 'covid', children: COVID_ROUTES},
      {path: 'education', children: EDUCATION_ROUTES},
      {path: 'dashboard', children: DASHBOARD_ROUTES},
      {path: 'cancer', children: CANCER_ROUTES},
      {path: 'renal', children: RENAL_ROUTES},
      {path: 'clinical-cohort', children: CLINICAL_COHORT_ROUTES},
      {
        path: 'support',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then(
            (m) => m.N3cSimplePageComponent
          ),
        data: {
          strapiEndpoint: 'support'
        }
      },
      {
        path: 'press-coverage',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/press-coverage/press-coverage.component').then(
            (m) => m.N3cPressCoverageComponent
          )
      },
      {
        path: 'forum',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then(
            (m) => m.N3cSimplePageComponent
          ),
        data: {
          strapiEndpoint: 'forum',
          contentProp: 'block1',
          headerProp: 'Header'
        }
      },
      {
        path: 'communications',
        loadComponent: () =>
          import('@odp/n3c/lib/components/enclave/communications/communications.component').then(
            (m) => m.N3cCommunicationsComponent
          )
      },
      {
        path: 'substance-use',
        loadComponent: () =>
          import('@odp/n3c/lib/components/dashboards/substance-use/substance-use.component').then(
            (m) => m.SubstanceUseComponent
          )
      },
      {
        path: '**',
        loadComponent: () =>
          import('@odp/n3c/lib/components/shared/page-not-found/page-not-found.component').then(
            (m) => m.PageNotFoundComponent
          )
      }
    ]
  }
];
