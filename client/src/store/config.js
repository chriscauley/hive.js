import { useLocalStorage } from '@unrest/ui'

// NB: `theme` here is the piece art style (see .theme-carbon in pieces.css),
// not the colour scheme. Light/dark lives in @unrest/ui now -- see src/theme.js.
const initial = {
  show_help: true,
  theme: 'classic',
  hex_angle: 'flat',
  zoom: 0,

  // not in schema
  chat_collapsed: false,
}

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    theme: {
      title: 'Theme',
      type: 'string',
      enum: ['classic', 'carbon'],
    },
    debug: {
      title: 'Show space numbers',
      type: 'boolean',
    },
    show_help: {
      type: 'boolean',
      title: 'Show Help',
      default: true,
    },
    hex_angle: {
      type: 'string',
      title: 'Hex Angle',
      enum: ['flat', 'pointy'],
    },
    zoom: {
      type: 'integer',
      title: 'Zoom',
    },
  },
}

export default () => {
  const config = useLocalStorage('config', initial)
  config.schema = schema
  const { state, save } = config
  config.form = { schema, state, onChange: save }
  return config
}
