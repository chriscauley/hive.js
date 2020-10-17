import React from 'react'
import Markdown from 'react-markdown'
import css from '@unrest/css'

const content = `
### 2020-10-17
* Changed fly completely (email me if you want me to add original in as a variant). Old fly was only useful in very rare circumstances.
* Added "lotus mantis" variant because default mantis was very underpowered. Now mantis is basically a beetle that sucks pieces under instead of stepping on top.
* Added help text for damselfly, lotus mantis, and new fly.
* Lots of improvements to game backend in preparation of replays.
`

export default function ChangeLog() {
  return (
    <div className={css.modal.outer()} style={{ position: 'relative' }}>
      <div className={css.modal.content()}>
        <h2>Change Log</h2>
        <Markdown source={content} className="markdown" />
      </div>
    </div>
  )
}
