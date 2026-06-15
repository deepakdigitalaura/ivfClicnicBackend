import * as migration_20260615_121444 from './20260615_121444';

export const migrations = [
  {
    up: migration_20260615_121444.up,
    down: migration_20260615_121444.down,
    name: '20260615_121444'
  },
];
