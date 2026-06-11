'use client';

/* A "Pages & Builder" entry pinned to the TOP of the admin sidebar (rendered via
 * admin.components.beforeNavLinks). Links to the full-screen launchpad
 * (/studio/pages) → each page's inline editor. Styled with Payload's own
 * `.nav__link` class so the brand theme (icon, active state) applies. */

export function PagesBuilderNavLink() {
  return (
    <div className="bfi-pb-navwrap">
      <a href="/studio/pages" className="nav__link bfi-pb-navlink">
        Pages &amp; Builder
      </a>
    </div>
  );
}

export default PagesBuilderNavLink;
