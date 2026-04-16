import {Routes} from '@angular/router';
import {SHARED_SUPPORT_ROUTES} from './shared-child.routes';

export const CLINICAL_COHORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/clinical-cohort/clinical-cohort.component').then(
        (m) => m.N3cClinicalCohortComponent
      )
  },
  ...SHARED_SUPPORT_ROUTES,
  {
    path: 'agreements',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/agreements/agreements.component').then((m) => m.N3cAgreementsComponent)
  },
  {
    path: 'researcher-essentials/registration',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'text-blocks',
      strapiFilters: {id: {$eq: 4}},
      showHeader: false,
      contentProp: 'content'
    }
  },
  {
    path: 'account-creation/registration-checklist',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/registration-checklist/registration-checklist.component').then(
        (m) => m.N3cRegistrationChecklistComponent
      )
  }
];
