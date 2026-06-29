import path from "path";
import { createRequire } from "module";
import { withPayload } from "@payloadcms/next/withPayload";

const require = createRequire(import.meta.url);
// `exports` in plugin-cloud-storage's package.json only allows the "."/
// "./utilities"/"./client" subpaths — even "./package.json" is blocked, so
// we can't require.resolve() our way to the package root directly. Resolve
// the "." entry (./dist/index.js, which *is* exported) and walk up two
// dirs to the package root instead, then join the deep path by hand.
const pluginCloudStorageRoot = path.dirname(
  path.dirname(require.resolve("@payloadcms/plugin-cloud-storage")),
);

/* ─── 301 redirects: old static routes → canonical CMS routes ─── */
const REDIRECTS = [
  // Treatment pages
  ["/asthenospermia",                                                    "/treatments/asthenospermia"],
  ["/azoospermia",                                                       "/treatments/azoospermia"],
  ["/blastocyst-culture-blastocyst-transfer",                            "/treatments/blastocyst-transfer"],
  ["/conceive-naturally",                                                "/treatments/conceive-naturally"],
  ["/cryopreservation",                                                  "/treatments/cryopreservation"],
  ["/egg-donation",                                                      "/treatments/egg-donation"],
  ["/egg-freezing",                                                      "/treatments/cryopreservation"],
  ["/embryo-donation",                                                   "/treatments/embryo-donation"],
  ["/embryo-freezing",                                                   "/treatments/cryopreservation"],
  ["/endometriosis",                                                     "/treatments/endometriosis"],
  ["/era-test",                                                          "/treatments/era-test"],
  ["/erectile-dysfunction",                                              "/treatments/erectile-dysfunction"],
  ["/fibroids",                                                          "/treatments/fibroids"],
  ["/icsi-treatment-intracytoplasmic-sperm-injection",                   "/treatments/icsi"],
  ["/intra-uterine-insemination-iui",                                    "/treatments/iui"],
  ["/intracytoplasmic-morphologically-selected-sperm-injection-imsi",    "/treatments/imsi"],
  ["/ivf-evaluation",                                                    "/treatments/ivf-evaluation"],
  ["/ivf-failure",                                                       "/treatments/ivf-failure"],
  ["/laser-assisted-hatching",                                           "/treatments/laser-hatching"],
  ["/magnetic-activated-cell-sorting-macs",                              "/treatments/macs"],
  ["/oligospermia",                                                      "/treatments/oligospermia"],
  ["/ovarian-rejuvenation",                                              "/treatments/ovarian-rejuvenation"],
  ["/ovarian-reserve",                                                   "/treatments/ovarian-reserve"],
  ["/pcos",                                                              "/treatments/pcos"],
  ["/pgt",                                                               "/treatments/pgt"],
  ["/physiological-intracytoplasmic-sperm-injection-picsi",              "/treatments/picsi"],
  ["/prp-infertility",                                                   "/treatments/prp-infertility"],
  ["/sperm-donation",                                                    "/treatments/sperm-donation"],
  ["/sperm-freezing",                                                    "/treatments/cryopreservation"],
  ["/spindle-view-icsi",                                                 "/treatments/spindle-view-icsi"],
  ["/surgical-sperm-retrieval",                                          "/treatments/surgical-sperm-retrieval"],
  ["/surrogacy",                                                         "/treatments/surrogacy"],
  ["/varicocele",                                                        "/treatments/varicocele"],
  ["/what-is-ivf",                                                       "/treatments/ivf"],
  // Calculator pages
  ["/ivf-success-rate-calculator",          "/calculators/ivf-success-rate"],
  ["/ivf-cost-calculator",                  "/calculators/ivf-cost"],
  ["/ovulation-calculator",                 "/calculators/ovulation"],
  ["/natural-pregnancy-calculator",         "/calculators/natural-pregnancy"],
  ["/fertile-period-calculator",            "/calculators/fertile-period"],
  ["/amh-level-interpreter",               "/calculators/amh-level"],
  ["/semen-analysis-calculator",            "/calculators/semen-analysis"],
  ["/risk-of-repeat-miscarriage-calculator","/calculators/miscarriage-risk"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return REDIRECTS.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },

  // @payloadcms/storage-vercel-blob's client upload handler imports
  // `getFileKey` from the `@payloadcms/plugin-cloud-storage/utilities`
  // barrel — which *also* re-exports `resolveSignedURLKey`, a server-only
  // util that transitively pulls in `undici` and several `node:`-prefixed
  // built-ins (node:async_hooks, node:buffer, node:console). Webpack can
  // polyfill bare `path`/`crypto` for the browser but refuses `node:`
  // specifiers outright, so bundling the admin client fails. We never use
  // signed URLs, so for the browser bundle only, redirect that barrel
  // import straight to the one file we actually need (no `node:` deps).
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["@payloadcms/plugin-cloud-storage/utilities"] = path.join(
        pluginCloudStorageRoot,
        "dist/utilities/getFileKey.js",
      );
    }
    return config;
  },

  // IMAGE STRATEGY — decision: keep `unoptimized: true` *while* the deploy
  // target is a static export with no image server.
  //  - next/image still earns its keep: explicit width/height (via `fill` +
  //    sized containers) reserves layout space (CLS≈0) and `priority` emits a
  //    <link rel=preload> for the LCP hero. `sizes` is authored everywhere so
  //    a real srcset appears automatically the moment optimization is enabled.
  //  - To get resizing + AVIF/WebP (byte-weight reduction) WITHOUT leaving
  //    static export, set a CDN loader in Phase B, e.g.:
  //        images: { loader: 'custom', loaderFile: './src/lib/cf-image-loader.ts' }
  //    backed by Cloudflare Images / Netlify Image CDN. Components need NO
  //    changes — only this config flips. Until then, source assets should be
  //    pre-compressed (hero exported as WebP/AVIF ≤150 KB).
  images: { unoptimized: true },
};

// withPayload mounts the CMS (admin + api) into this Next app. devBundleServerPackages
// is left default; the existing (frontend) build behaviour is unchanged.
export default withPayload(nextConfig);
