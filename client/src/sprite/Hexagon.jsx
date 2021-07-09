// const points = '300,130 225,260 75,260 0,130 75,0 225,0'.split(' ').map((s) => s.split(','))

export default ({ width, cls }) => {
  // const s = width / 300
  const height = width * 0.866
  return (
    <>
      <foreignObject width={width} height={height}>
        <div class={cls} />
      </foreignObject>
    </>
  )
}
