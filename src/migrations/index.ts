import * as migration_20260615_121444 from './20260615_121444';
import * as migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated from './20260616_103116_blog_fields_locationslugs_faqs_lastupdated';
import * as migration_20260616_113942_blog_dropdowns_and_content_blocks from './20260616_113942_blog_dropdowns_and_content_blocks';
import * as migration_20260620_093506_add_calculators_collection from './20260620_093506_add_calculators_collection';
import * as migration_20260620_132418_add_video_collections from './20260620_132418_add_video_collections';
import * as migration_20260624_add_hero_text_dark_to_blogs from './20260624_add_hero_text_dark_to_blogs';

export const migrations = [
  {
    up: migration_20260615_121444.up,
    down: migration_20260615_121444.down,
    name: '20260615_121444',
  },
  {
    up: migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated.up,
    down: migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated.down,
    name: '20260616_103116_blog_fields_locationslugs_faqs_lastupdated',
  },
  {
    up: migration_20260616_113942_blog_dropdowns_and_content_blocks.up,
    down: migration_20260616_113942_blog_dropdowns_and_content_blocks.down,
    name: '20260616_113942_blog_dropdowns_and_content_blocks',
  },
  {
    up: migration_20260620_093506_add_calculators_collection.up,
    down: migration_20260620_093506_add_calculators_collection.down,
    name: '20260620_093506_add_calculators_collection',
  },
  {
    up: migration_20260620_132418_add_video_collections.up,
    down: migration_20260620_132418_add_video_collections.down,
    name: '20260620_132418_add_video_collections'
  },
  {
    up: migration_20260624_add_hero_text_dark_to_blogs.up,
    down: migration_20260624_add_hero_text_dark_to_blogs.down,
    name: '20260624_add_hero_text_dark_to_blogs',
  },
];
