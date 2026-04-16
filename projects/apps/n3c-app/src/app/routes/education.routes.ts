import {Routes} from '@angular/router';
import {SHARED_SUPPORT_ROUTES} from './shared-child.routes';

export const EDUCATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/education/education.component').then((m) => m.N3cEducationComponent)
  },
  {
    path: 'tenant-duas',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/tenant-duas/tenant-duas.component').then(
        (m) => m.N3cTenantDuasPageComponent
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
  ...SHARED_SUPPORT_ROUTES,
  {
    path: 'agreements',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/agreements/agreements.component').then((m) => m.N3cAgreementsComponent)
  }
];
