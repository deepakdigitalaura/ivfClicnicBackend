import pg from "pg";
const { Client } = pg;
const client = new Client({ connectionString: "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres", ssl: { rejectUnauthorized: false } });
await client.connect();

// Check columns
let r = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='header_nav_items_columns_items' ORDER BY ordinal_position");
console.log("=== header_nav_items_columns_items columns ===");
r.rows.forEach(r => console.log(`  ${r.column_name}`));

// Get all items
r = await client.query(`
  SELECT ni.label AS nav_label, ni._order AS nav_order, col._order AS col_order, item.*
  FROM header_nav_items ni
  LEFT JOIN header_nav_items_columns col ON col._parent_id = ni.id
  LEFT JOIN header_nav_items_columns_items item ON item._parent_id = col.id
  ORDER BY ni._order, col._order, item._order
`);
console.log("\n=== All header nav items ===");
for (const row of r.rows) {
  if (row.label) console.log(`  [${row.nav_label}] ${row.label} → url="${row.url}" href="${row.href}" link_href="${row.link_href}" destination="${row.destination}"`);
}

await client.end();
