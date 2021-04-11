import css from '@unrest/css'

const content = `
* Game rules and (most) design elements originated from the borad game Hive by Jhon Yianni. [Learn more at Board Game Geek](https://boardgamegeek.com/forums/thing/2655/hive).
* Assets and extra rules taken from [A collection of variant pieces ](https://boardgamegeek.com/filepage/90063/collection-variant-pieces) and [Hive Swarm](https://boardgamegeek.com/filepage/95016/hive-swarm).
* This article on [Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/) by Red Blob Games was used frequently while writting this program.
* This app was made by me using react and is hosted at github at [chriscauley/hive.js](https://github.com/chriscauley/hive.js/). Feel free to create an issue or message [@chriscauley](https://boardgamegeek.com/user/chriscauley) on Board Game Geek.
* Icons made by [Freepik](https://www.flaticon.com/authors/freepik) and [Vitaly Gorbachev](https://www.flaticon.com/authors/vitaly-gorbachev) at www.flaticon.com
`

export default {
  __route: {
    path: '/about/',
    meta: {},
  },
  render: () => (
    <section>
      <div className={css.modal.outer()} style={{ position: 'relative', zIndex: 1 }}>
        <div className={css.modal.content()}>
          <h2>About</h2>
          <vue3-markdown-it source={content} className="markdown" />
        </div>
      </div>
    </section>
  ),
}
