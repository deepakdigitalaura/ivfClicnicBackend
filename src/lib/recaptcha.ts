/* =====================================================================
 * One loader for Google's reCAPTCHA script, shared by every form.
 * ---------------------------------------------------------------------
 * TWO THINGS GO WRONG IF EACH FORM ROLLS ITS OWN:
 *
 * 1. `window.grecaptcha` exists almost immediately after api.js starts
 *    running, but at that point it is a stub carrying only `ready`.
 *    `render` is attached later. Resolving on the script's `load` event --
 *    or worse, on `window.grecaptcha` merely being truthy -- hands the
 *    caller an object whose `render` is still undefined, the call throws
 *    inside a promise nobody is catching, and the widget silently never
 *    appears. The form then refuses to submit, because validation asks for
 *    a token from a checkbox the visitor was never shown. `ready()` is the
 *    only correct signal, so it is waited on here, once, for everyone.
 *
 * 2. The home page carries an inquiry form AND the appointment pop-up, so
 *    two forms want the script on the same page. A second api.js re-stubs
 *    the global and can leave the first widget broken. A module-level
 *    promise means the script is injected exactly once per page, and the
 *    second caller simply awaits the first load.
 * ===================================================================== */

export type Grecaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
  ready: (cb: () => void) => void;
};

declare global {
  interface Window { grecaptcha?: Grecaptcha }
}

let pending: Promise<Grecaptcha> | null = null;

/** Inject Google's script once per page, on demand (keeps it off first paint). */
export const loadRecaptcha = (): Promise<Grecaptcha> =>
  (pending ??= new Promise<Grecaptcha>((resolve) => {
    const settle = () => {
      const g = window.grecaptcha;
      if (g?.ready) g.ready(() => resolve(g));
    };
    if (window.grecaptcha?.ready) return settle();
    const s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = settle;
    document.head.appendChild(s);
  }));
