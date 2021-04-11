import css from '@unrest/css'

const content = {
  'v1.0.2 Dec 28, 2020': [
    'NEW PIECE: Praying Mantis can leap onto furthest piece in any direction and drag a stacked piece with it.',
    'NEW PIECE: Kung Fu Mantis can grab a piece two spaces away and move it underneath.',
    'NEW PIECE: Emerald Wasp can take two steps onto the hive (or step off if starting on the hive).',
    'NEW PIECE: Lanternfly Nymph can move to any empty space surrounded on 3 or more sides.',
    'Mosquito can now copy every move by every piece (does not copy passives).',
    'Minor ui tweaks.',
  ],
  'v1.0.1 Nov 14, 2020': [
    'NEW PIECE: Lanternfly can fly over the hive to any open space is touching pieces on 3 sides (otherwise moves like queen).',
    'NEW PIECE: Orbweaver Spider moves like a spider and no piece can move over it (this ability has been taken from scorpion which now only blocks stacking pieces).',
    'Changed all variations (spiderwebs, venom_centipede, damselfly, super grasshopper) into piece (trapdoor spider, earthworm, damselfly, cicada)',
    'Added preview piece widget to New Game and "waiting for host to select rules" screens.',
    'All pieces are now svgs.',
  ],
  'v.1.0.0b Oct 24, 2020': [
    'Pick any combinaton of tiles in new game.',
    'Select stack + hover to expand',
  ],
  'v1.0.0a Oct 17, 2020': [
    'Dark mode! (config dropdown)',
    'Changed fly completely (email me if you want me to add original in as a variant). Old fly was only useful in very rare circumstances.',
    'Added "lotus mantis" variant because default mantis was very underpowered. Lotus Mantis is on par with beetle.',
    'Added help text for damselfly, lotus mantis, and new fly.',
    'Lots of improvements to game backend in preparation of replays.',
  ],
}

const getId = s => s.split(' ')[0].replace(/\./g, '-')

export default {
  __route: {
    path: '/change-log/',
    meta: {},
  },
  render: () => (
    <div>
      <div className={css.modal.outer()} style={{ position: 'relative', zIndex: 1 }}>
        <div className={css.modal.content()}>
          <h2>Change Log</h2>
          {Object.entries(content).map(([title, items]) => (
            <div
              key={title}
              id={getId(title)}
              className="mb-4 pb-2 border-b border--text-alt last:border-b-0"
            >
              <h3>{title}</h3>
              <ul className="browser-default">
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
