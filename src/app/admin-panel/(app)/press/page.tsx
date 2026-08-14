import { readAdminPress } from "@/sanity/lib/admin";
import { PressManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function PressAdminPage() {
  const items = await readAdminPress();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Media & Press Coverage</h1>
        <p className="admin-sub">
          Manage newspaper clippings shown on /press. Headline and body text must be
          faithfully transcribed from the real clipping — never invented or paraphrased.
        </p>
      </div>
      <PressManager initial={items} />
    </>
  );
}
