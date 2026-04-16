import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {SiteStatusService} from '../site-status-service/site-status.service';
import {EVENT_SERVICE} from '../types';
import {BANNER_MSG_KEY} from '../api-constants';

export const siteStatusGuard: CanActivateFn = async (_route, state) => {
  const svc = inject(SiteStatusService);
  const router = inject(Router);
  const eventService = inject(EVENT_SERVICE);

  try {
    const s = await svc.getSiteStatus();
    const targetUrl = state.url;
    const targetPath = targetUrl.replace(/^\//, '');
    const msgPagePath = s.redirect_url ? s.redirect_url.replace(/^\//, '') : null;

    if (s?.banner_message) {
      eventService.get(BANNER_MSG_KEY).next(s.banner_message);
    }
    if (targetPath === msgPagePath) return true;
    if (s.redirect_url) {
      const singleParentRoute = router.config.length > 1;
      let isInternal: boolean = false;
      if (singleParentRoute) {
        isInternal = router.config.some((r) => r.path === s!.redirect_url!.replace(/^\//, ''));
      } else {
        isInternal = router.config[0].children?.some((r) => r.path === s!.redirect_url!.replace(/^\//, '')) ?? false;
      }
      if (isInternal) {
        return router.parseUrl(s.redirect_url);
      } else {
        return true;
      }
    }

    return true; // no redirect
  } catch {
    return true; // on error, allow navigation
  }
};
