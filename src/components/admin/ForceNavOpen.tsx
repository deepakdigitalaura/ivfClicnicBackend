'use client';

/* =====================================================================
 * Keeps the admin sidebar OPEN on desktop so non-technical staff always see
 * every section. This must drive Payload's real `navOpen` state (not just CSS):
 * Payload marks a CLOSED nav `inert`, which makes the links visible-but-
 * unclickable. By forcing the state open, the nav renders open natively AND
 * stays interactive. No-ops on mobile (< 1024px), where the nav is a modal
 * overlay that should stay closed until the hamburger is tapped. Renders nothing.
 * Registered via admin.components.beforeNavLinks (inside the Nav provider).
 * ===================================================================== */

import { useEffect } from 'react';
import { useNav } from '@payloadcms/ui';

export function ForceNavOpen() {
  const { navOpen, setNavOpen } = useNav();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop && !navOpen) setNavOpen(true);
  }, [navOpen, setNavOpen]);
  return null;
}

export default ForceNavOpen;
