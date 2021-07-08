const points = '300,130 225,260 75,260 0,130 75,0 225,0'.split(' ').map((s) => s.split(','))

export default ({ width, type, player }) => {
  const s = width / 300
  const height = width * 0.866
  const cls = `hex hex-player_${player} type type-${type} piece`
  return (
    <>
      <polygon points={points.map((p) => p.map((i) => i * s))} />
      <foreignObject width={width} height={height}>
        <div class={cls} />
      </foreignObject>
    </>
  )
}
