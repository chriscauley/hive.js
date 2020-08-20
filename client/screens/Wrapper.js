import React from 'react'

export default function Wrapper({children}) {
  return <div className="flex-grow flex items-center justify-center relative">{children}</div>
}