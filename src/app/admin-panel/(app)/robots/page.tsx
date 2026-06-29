import { readRobots } from "@/sanity/lib/admin";
import { RobotsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function RobotsPage() {
  const data = await readRobots();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Robots.txt</h1>
        <p className="admin-sub">Control how search engines crawl your site.</p>
      </div>
      <RobotsForm initial={data} />
    </>
  );
}
