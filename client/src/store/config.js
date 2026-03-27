import { useLocalStorage } from '@unrest/ui'

const initial = {
  show_help: true,
  theme: 'classic',
  darkmode: true,
  hex_angle: 'flat',
  zoom: 0,

  // not in schema
  chat_collapsed: false,
}

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    darkmode: {
      title: 'Dark Mode',
      type: 'boolean',
    },
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

const applyTheme = (darkmode) => {
  document.documentElement.setAttribute('data-theme', darkmode ? 'dark' : 'light')
}

export default () => {
  const config = useLocalStorage('config', initial)
  config.schema = schema
  const { state, save } = config
  const onChange = (data) => {
    save(data)
    applyTheme(state.darkmode)
  }
  config.form = { schema, state, onChange }
  applyTheme(state.darkmode)
  return config
}
