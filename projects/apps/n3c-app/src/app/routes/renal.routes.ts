import {Routes} from '@angular/router';
import {SHARED_SUPPORT_ROUTES} from './shared-child.routes';

export const RENAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/renal/renal.component').then((m) => m.N3cRenalComponent)
  },
  {
    path: 'participants',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'text-blocks',
      strapiFilters: {id: {$eq: 2}},
      contentProp: 'content'
    }
  },
  ...SHARED_SUPPORT_ROUTES
];
