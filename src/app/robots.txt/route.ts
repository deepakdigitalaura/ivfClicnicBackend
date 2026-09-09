import { getRobotsConfig } from "@/sanity/lib/fetch";
import { DEFAULT_ROBOTS_TXT } from "@/lib/robots-presets";

export async function GET() {
  const config = await getRobotsConfig();
  const body = config?.rawContent?.trim() ? config.rawContent : DEFAULT_ROBOTS_TXT;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
