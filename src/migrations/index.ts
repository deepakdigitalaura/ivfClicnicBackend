import * as migration_20260615_121444 from './20260615_121444';
import * as migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated from './20260616_103116_blog_fields_locationslugs_faqs_lastupdated';

export const migrations = [
  {
    up: migration_20260615_121444.up,
    down: migration_20260615_121444.down,
    name: '20260615_121444',
  },
  {
    up: migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated.up,
    down: migration_20260616_103116_blog_fields_locationslugs_faqs_lastupdated.down,
    name: '20260616_103116_blog_fields_locationslugs_faqs_lastupdated'
  },
];
