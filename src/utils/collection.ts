
export const pluck = <T extends Record<string, any>>(collection: T[], key: string, callback?: (row: T) => void) => {
  const plucked: T[] = []

  for (const row of collection) {
    if (row && key in row) {
      plucked.push(row[key])

      if (callback) {
        callback(row)
      }
    }
  }

  return plucked
}
