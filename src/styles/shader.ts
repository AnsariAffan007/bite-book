export const getShade = (shade: number, intensity: number) => (
  shade === 0
    ? `rgba(0, 0, 0, ${intensity})`
    : `rgba(255, 255, 255, ${intensity})`
)