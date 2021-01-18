
export const pluck = (collection: Array<any>, key: string, callback?: (row: any) => void) => {
  const plucked: Array<any> = []

  for (const row of collection) {
    if (key in row) {
      plucked.push(row[key])

      if (callback) {
        callback(row)
      }
    }
  }

  return plucked
}
