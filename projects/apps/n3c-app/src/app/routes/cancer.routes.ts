import {Routes} from '@angular/router';
import {SHARED_SUPPORT_ROUTES} from './shared-child.routes';

export const CANCER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/cancer/cancer.component').then((m) => m.N3cCancerComponent)
  },
  {
    path: 'participants',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'text-blocks',
      strapiFilters: {id: {$eq: 1}},
      contentProp: 'content'
    }
  },
  ...SHARED_SUPPORT_ROUTES
];
