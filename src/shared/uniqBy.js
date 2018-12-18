export default function uniqBy (inputArray, predicate) {
  return inputArray
    .sort((a, b) => predicate(a) > predicate(b))
    .filter((x, i, arr) => i === arr.length - 1
      ? true
      : predicate(x) !== predicate(arr[i + 1])
    )
}
