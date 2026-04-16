import {Routes} from '@angular/router';

export const SHARED_SUPPORT_ROUTES: Routes = [
  {
    path: 'support',
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent),
    data: {
      strapiEndpoint: 'support'
    }
  },
  {
    path: 'faq',
    loadComponent: () => import('@odp/n3c/lib/components/enclave/faq/faq.component').then((m) => m.N3cFaqPageComponent)
  },
  {
    path: 'liaisons',
    data: {
      strapiEndpoint: 'liaison'
    },
    loadComponent: () =>
      import('@odp/n3c/lib/components/enclave/simple-page/simple-page.component').then((m) => m.N3cSimplePageComponent)
  }
];
