/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone output is only for VPS/Docker — Vercel uses its own system
  output: process.env.VERCEL ? undefined : "standalone",
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      // Treatment pages
      { source: "/asthenospermia",                                                    destination: "/treatments/asthenospermia",           permanent: true },
      { source: "/azoospermia",                                                       destination: "/treatments/azoospermia",              permanent: true },
      { source: "/blastocyst-culture-blastocyst-transfer",                            destination: "/treatments/blastocyst-transfer",      permanent: true },
      { source: "/conceive-naturally",                                                destination: "/treatments/conceive-naturally",       permanent: true },
      { source: "/cryopreservation",                                                  destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/egg-donation",                                                      destination: "/treatments/egg-donation",             permanent: true },
      { source: "/egg-freezing",                                                      destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/treatments/egg-freezing",                                           destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/embryo-donation",                                                   destination: "/treatments/embryo-donation",          permanent: true },
      { source: "/embryo-freezing",                                                   destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/treatments/embryo-freezing",                                        destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/endometriosis",                                                     destination: "/treatments/endometriosis",            permanent: true },
      { source: "/era-test",                                                          destination: "/treatments/era-test",                 permanent: true },
      { source: "/erectile-dysfunction",                                              destination: "/treatments/erectile-dysfunction",     permanent: true },
      { source: "/fibroids",                                                          destination: "/treatments/fibroids",                 permanent: true },
      { source: "/icsi-treatment-intracytoplasmic-sperm-injection",                   destination: "/treatments/icsi",                    permanent: true },
      { source: "/intra-uterine-insemination-iui",                                    destination: "/treatments/iui",                     permanent: true },
      { source: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi",    destination: "/treatments/imsi",                    permanent: true },
      { source: "/ivf-evaluation",                                                    destination: "/treatments/ivf-evaluation",          permanent: true },
      { source: "/ivf-failure",                                                       destination: "/treatments/ivf-failure",             permanent: true },
      { source: "/laser-assisted-hatching",                                           destination: "/treatments/laser-hatching",          permanent: true },
      { source: "/magnetic-activated-cell-sorting-macs",                              destination: "/treatments/macs",                    permanent: true },
      { source: "/oligospermia",                                                      destination: "/treatments/oligospermia",            permanent: true },
      { source: "/ovarian-rejuvenation",                                              destination: "/treatments/ovarian-rejuvenation",    permanent: true },
      { source: "/ovarian-reserve",                                                   destination: "/treatments/ovarian-reserve",         permanent: true },
      { source: "/pcos",                                                              destination: "/treatments/pcos",                    permanent: true },
      { source: "/pgt",                                                               destination: "/treatments/pgt",                     permanent: true },
      { source: "/physiological-intracytoplasmic-sperm-injection-picsi",              destination: "/treatments/picsi",                   permanent: true },
      { source: "/prp-infertility",                                                   destination: "/treatments/prp-infertility",         permanent: true },
      { source: "/sperm-donation",                                                    destination: "/treatments/sperm-donation",          permanent: true },
      { source: "/sperm-freezing",                                                    destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/treatments/sperm-freezing",                                         destination: "/treatments/cryopreservation",         permanent: true },
      { source: "/spindle-view-icsi",                                                 destination: "/treatments/spindle-view-icsi",       permanent: true },
      { source: "/surgical-sperm-retrieval",                                          destination: "/treatments/surgical-sperm-retrieval",permanent: true },
      { source: "/surrogacy",                                                         destination: "/treatments/surrogacy",               permanent: true },
      { source: "/varicocele",                                                        destination: "/treatments/varicocele",              permanent: true },
      { source: "/what-is-ivf",                                                       destination: "/treatments/ivf",                     permanent: true },
      // Calculator pages
      { source: "/ivf-success-rate-calculator",            destination: "/calculators/ivf-success-rate",   permanent: true },
      { source: "/ivf-cost-calculator",                    destination: "/calculators/ivf-cost",           permanent: true },
      { source: "/ovulation-calculator",                   destination: "/calculators/ovulation",          permanent: true },
      { source: "/natural-pregnancy-calculator",           destination: "/calculators/natural-pregnancy",  permanent: true },
      { source: "/fertile-period-calculator",              destination: "/calculators/fertile-period",     permanent: true },
      { source: "/amh-level-interpreter",                  destination: "/calculators/amh-level",          permanent: true },
      { source: "/semen-analysis-calculator",              destination: "/calculators/semen-analysis",     permanent: true },
      { source: "/risk-of-repeat-miscarriage-calculator",  destination: "/calculators/miscarriage-risk",   permanent: true },
    ];
  },

  images: { unoptimized: true },
};

export default nextConfig;
