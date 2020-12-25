export default {
  slugs: [
    'basics',
    'onehive',
    'stacks',
    'queen',
    'beetle',
    'grasshopper',
    'ant',
    'spider',
    'ladybug',
    'mosquito',
    'pill_bug',
    'orchid_mantis',
    'praying_mantis',
    'fly',
    'wasp',
    'scorpion',
    'cockroach',
    'dragonfly',
    'damselfly',
    'centipede',
    'cicada',
    'lanternfly',
    'trapdoor_spider',
    'orbweaver',
    'emerald_wasp',
  ],
  basics: [
    'To start, each player places a piece next to each other.',
    'Each turn a player can either *place* one piece or move one piece.',
    'The goal of the game is to surround the enemy queen on all sides.',
    'Pieces can only be placed next to a friendly piece (except for the first two turns).',
    'Other than during the placing phase, every piece moves differently.',
    'Clicking on a piece shows all possible moves (even if it is the other players turn).',
  ],
  onehive: [
    'Each piece moves differently, but the board must always be "one hive".',
    'A piece cannot move if moving that piece would break the hive (even temporarily).',
    'Pieces that cannot move or be moved without violating this rule are grayed out.',
  ],
  stacks: [
    'Some pieces can move onto the hive.',
    'For placing or similar purposes, only the color of the top piece matters.',
    'Only the top piece on a stack can move or be moved.',
  ],
  queen: [
    'From this position, the white queen can move to one of two spaces. It cannot move between the beetle and ant because it cannot fit.',
    'The black queen cannot move without breaking the hive.',
  ],
  beetle: [
    'From on top of the hive, the white beetle can step down to one of four spaces or continue on the hive by moving onto one of two tiles.',
    'From the ground, the black beetle can step along the hive or step on the hive for a total of five possible moves.',
  ],
  grasshopper: [
    'The black grasshopper can move to three different spaces.',
    'The white grasshopper can move to two different spaces.',
    'With super_grasshopper turned on the black and white pieces can move to 6 and 7 spaces respectively',
  ],
  spider: 'From this position, the white spider can move to one of three spaces.',
  ant: [
    'Normally, both ants can move to any open space on the board.',
    'If spiderwebs are enabled, the black ant can get trapped on the far spider.',
  ],
  ladybug: ['The black ladybug can move to one of five open spaces, the white ladybug eight.'],
  mosquito: [
    'From this position, the black mosquito can move as a scorpion, queen, or grasshopper.',
    'On top of the hive, the white mosquito moves like a beetle. It cannot step on the scorpion because have you ever stepped on a scorpion? It hurts.',
  ],
  pill_bug: [
    'From this position, the pill bug can move to one of two spaces.',
    'Alternatively, it can move the white queen to one of three spaces.',
  ],
  orchid_mantis: [
    'The white orchid mantis cannot move, but it can pull the queen or grasshopper under itself.',
    'From on top of the hive, the black orchid mantis moves like a beetle.',
  ],
  praying_mantis: [
    // TODO preying_mantis
  ],
  fly: [
    'The white fly can climb onto one of two pieces.',
    'From on top of the hive, the black fly can move to any ground level space (except those blocked by scorpions).',
  ],
  scorpion: [
    'From this position the scorpion can move to one of two spaces.',
    'The beetle and grasshopper have their moves restricted by the adjacent scorpion.',
  ],
  wasp: [
    'The black wasp can move to one of four spaces.',
    'The white wasp can move to one of six spaces.',
  ],
  cockroach: [
    'The black cockroach can step on any adjacent black piece, and then off the hive for a total of 8 possible moves.',
    'The white cockroach is blocked by the enemy beetle and fly, and cannot move at all.',
  ],
  dragonfly: [
    'The black dragonfly can move to one of three spaces. It cannot land on the scorpion',
    'The white dragonfly has six possible moves. If it moves to one of the three unoccupied spaces, it must move the spider its on top of as well.',
  ],
  damselfly: [
    'The black damselfly can move along the hive to one of two spaces or diagonally to one of three spaces. It cannot land on the scorpion',
    'The white damselfly has six possible moves. If it moves to one of the five unoccupied spaces, it must move the spider its on top of as well.',
  ],
  centipede: [
    'From this position, the centipede can move to one of two spaces.',
    'Alternatively, it can switch places with the grasshopper.',
  ],
  cicada: [
    'The black cicada can make one move by jumping over the hive.',
    'The white cicada can jump over the ant or jump over the white queen, black queen, and black cicada (stopping anywhere along the way).',
  ],
  lanternfly: [
    'The white laternfly can move one space in either direction.',
    'Surrounded on 3 sides, the black lantern fly can move over the hive to any square.',
  ],
  trapdoor_spider: [
    'The white trapdoor spider has 3 possible hop over 4 tiles or move 3 tiles along the hive.',
    'The black trapdoor spider cannot move (one hive rule)',
    'If either cicada lands next to the enemy trapdoor spider, it stops moving.',
    'The white ant cannot move past the black spider.',
    'The black ant starts touching the white spider, so it cannot get trapped by its webs.',
  ],
  orbweaver: ['Every piece is in some way limited by both friendly and enemy orbweavers.'],
  emerald_wasp: [
    'The black emerald wasp move onto two spaces (by first stepping on the white emerald wasp).',
    'The whiet emerald wasp can step off the hive to three different spaces.',
  ],
}
