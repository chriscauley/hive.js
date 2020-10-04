import React from 'react'

function ZoomInput(props) {
  const add = value => () => {
    const new_index = value + ZoomInput.enum.indexOf(props.value)
    const new_value = ZoomInput.enum[new_index]
    if (new_value) {
      props.onChange(new_value)
    }
  }
  return (
    <div className="flex justify-between items-center">
      <i className="fa fa-minus mr-2 cursor-pointer" onClick={add(-1)} />
      <div>{props.value}</div>
      <i className="fa fa-plus mr-2 cursor-pointer" onClick={add(1)} />
    </div>
)
  return (
    <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
        {String(props.value)}
    </button>
  )
}

ZoomInput.enum = ['smallest', 'small', 'medium', 'large', 'largest']

export default ZoomInput
