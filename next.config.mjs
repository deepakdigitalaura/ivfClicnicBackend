import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
