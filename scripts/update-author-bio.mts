/* =====================================================================
 * Update Dr. Parth Bavishi's author bio with detailed information.
 * Run: npx tsx --env-file=.env.local --tsconfig tsconfig.json scripts/update-author-bio.mts
 * ===================================================================== */
import { getPayload } from "payload";
import config from "@payload-config";

const AUTHOR_ID = 3; // Dr. Parth Bavishi

const BIO = `Dr. Parth Bavishi holds an MD in Obstetrics and Gynaecology and brings over 12 years of specialist experience as Co-director and IVF Specialist at Bavishi Fertility Institute — a group of fertility centres across India committed to helping couples realise their dream of parenthood.

His clinical focus is on complex and challenging cases: male-factor infertility, poor sperm quality, high sperm DNA fragmentation, and repeated IVF failure. He has received specialised infertility training at three internationally recognised institutions — Bavishi Fertility Institute, the Diamond Institute (USA), and the HART Institute (Japan) — giving him a uniquely broad perspective on the latest global advances in reproductive medicine.

Dr. Bavishi is the author of 'Your Miracle in Making: A Couple's Guide to Pregnancy,' an acclaimed book that offers practical, compassionate guidance to couples navigating the emotional and medical complexities of fertility treatment. His philosophy is rooted in patient empowerment: he believes that informed patients make better decisions, and he is committed to education both in the clinic and through public awareness.

His outstanding contributions to the field of reproductive medicine have been recognised with the prestigious Rose of Paracelsus Award from the European Medical Association. He is a regular invited faculty member at national and international conferences, sharing expertise on advanced reproductive techniques and male infertility.

Under his leadership, Bavishi Fertility Institute is dedicated to treatments that are simple, safe, smart, and successful — blending clinical excellence with the personalised, compassionate care that every patient deserves.`;

async function main() {
  const payload = await getPayload({ config });

  await payload.update({
    collection: "authors",
    id: AUTHOR_ID,
    data: {
      credentials: "MBBS, MD (Obstetrics & Gynaecology)",
      role: "Co-director & IVF Specialist",
      bio: BIO,
    },
  });

  console.log(`✅ Updated bio for author #${AUTHOR_ID} (Dr. Parth Bavishi).`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
