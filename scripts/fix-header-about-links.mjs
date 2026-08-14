import pg from "pg";
const { Client } = pg;
const client = new Client({ connectionString: "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres", ssl: { rejectUnauthorized: false } });
await client.connect();

const fixes = [
  { label: "Why Bavishi Fertility Institute",  url: "/why-bfi" },
  { label: "Simple Treatment",                  url: "/simple-treatment" },
  { label: "Safe Treatment",                    url: "/safe-treatment" },
  { label: "Smart Treatment",                   url: "/smart-treatment" },
  { label: "Success Benchmarks",                url: "/success-benchmarks" },
  { label: "History",                           url: "/history" },
  { label: "Infrastructure",                    url: "/infrastructure" },
  { label: "Suraksha Kavach Package",           url: "/suraksha-kavach" },
  { label: "Easy / Interest Free EMI",          url: "/easy-emi" },
];

for (const { label, url } of fixes) {
  const r = await client.query(
    `UPDATE header_nav_items_columns_items SET url = $1 WHERE label = $2 RETURNING id`,
    [url, label]
  );
  console.log(`${r.rowCount} row(s) updated: "${label}" → "${url}"`);
}

await client.end();
console.log("\nDone. Revalidate cache or redeploy to see changes live.");
