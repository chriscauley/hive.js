export default {
  slugs: [
    'basics',
    'onehive',
    'queen',
    'beetle',
    'grasshopper',
    'spider',
    'ant',
    'lady_bug',
    'mosquito',
    'mantis',
    'fly',
    'scorpion',
    'wasp',
    'cockroach',
    'dragonfly',
    'centipede',
  ],
  basics: [
    'To start, each player places a piece next to each other.',
    'Each turn a player can either *place* one piece or move one piece.',
    'The goal of the game is to surround the enemy queen on all sides.',
    'Pieces can only be placed next to a friendly piece (except for the first two turns).',
    'Other than during the placing phase, every piece moves differently.',
  ],
  onehive: [
    'Each piece moves differently, but the board must always be "one hive".',
    'A piece cannot move if moving that piece would break the hive (even temporarily).',
    'Pieces that cannot be moved without violating this rule are grayed out.',
  ],
  queen: [
    'From this position, the white Queen can move to one of two spaces.',
    'The black queen cannot move without breaking the hive',
  ],
  beetle: [
    'From this position, the white Beetle can move to one of five spaces, three of them being on top the Hive.',
    'From this position, on top the Black Grasshopper, the white Beetle can move to one of six spaces.',
  ],
  grasshopper:
    'From this position, the Grasshopper can move to one of two spaces',
  spider:
    'From this position, the white Spider can move to one of three spaces.',
  ant: [
    'Both ants can move to any open space on the board.',
    'If spiderwebs are enabled, the black ant can get trapped on the far spider.',
  ],
  lady_bug: [
    'The black Ladybug can move to one of six open spaces, the white Ladybug five.',
  ],
  mosquito: [
    'From this position, the white Mosquito can move to one of five spaces. It can move as a Scorpion, Queen Bee, or Grasshopper.',
    'On top of the hive, the black mosquito moves like a beetle.',
  ],
  pill_bug: [
    'From this position, the Pill Bug can move to one of two spaces',
    'Alternatively, it can move the white Queen Bee to one of three spaces.',
  ],
  mantis: [
    'From this position, the Mantis can only move the white Queen Bee under itself.',
    'From this position, on top of the white Queen Bee, the Mantis can move to  one of six spaces.',
  ],
  fly: [
    'From this position the white Fly can move to one of two spaces.',
    'From this position the black Fly can move to one of fifteen spaces.',
  ],
  scorpion: [
    'From this position the Scorpion can move to one of two spaces.',
    'From this position the Grasshopper can move to one of two spaces. It cannot jump over the Scorpion.',
  ],
  wasp: [
    'From this position the black Wasp can move to one of four spaces.',
    'From this position the white Wasp can move to one of six spaces.',
  ],
  cockroach: [
    'From this position the Cockroach can move to one of four spaces.',
    'From this position the Cockroach cannot move.',
  ],
  dragonfly: [
    'From this position the Dragonfly can move to one of three spaces.',
    'From this position, on top of the black Beetle, the Dragonfly can move to one of four spaces. If it moves to one of the three unoccupied spaces, it must move the Beetle as well.',
  ],
  centipede: [
    'From this position, the Centipede can move to one of two spaces.',
    'Alternatively, it can switch places with the Grasshopper.',
  ],
}
