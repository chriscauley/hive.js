const lines = [
  'Game rules and (most) design elements originated from the board game Hive by John Yianni. <a href="https://boardgamegeek.com/forums/thing/2655/hive">Learn more at Board Game Geek</a>.',
  'Assets and extra rules taken from <a href="https://boardgamegeek.com/filepage/90063/collection-variant-pieces">A collection of variant pieces</a> and <a href="https://boardgamegeek.com/filepage/95016/hive-swarm">Hive Swarm</a>.',
  'This article on <a href="https://www.redblobgames.com/grids/hexagons/">Hexagonal Grids</a> by Red Blob Games was used frequently while writing this program.',
  'This app was made by me using Vue and is hosted on GitHub at <a href="https://github.com/chriscauley/hive.js/">chriscauley/hive.js</a>. Feel free to create an issue or message <a href="https://boardgamegeek.com/user/chriscauley">@chriscauley</a> on Board Game Geek.',
  'Icons made by <a href="https://www.flaticon.com/authors/freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/vitaly-gorbachev">Vitaly Gorbachev</a> at www.flaticon.com',
]

export default {
  __route: {
    path: '/about/',
    meta: {},
  },
  render: () => (
    <section>
      <div class="modal -relative">
        <div class="modal__content -auto">
          <h2>About</h2>
          <ul class="list-disc list-inside">
            {lines.map((line, i) => (
              <li key={i} domPropsInnerHTML={line} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  ),
}
