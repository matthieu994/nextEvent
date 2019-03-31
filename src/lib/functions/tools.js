export const sortObject = (objArray, property) => {
  const array = []
  for (const obj in objArray) array.push({ id: obj, properties: objArray[obj] })

  if (property)
    return array.sort((a, b) => {
      return a.properties[property] - b.properties[property]
    })
  return array
}

export const sortArray = (array, property) => {
  return array.sort((a, b) => {
    return a.properties[property] - b.properties[property]
  })
}

export const pick = (obj, keys) => {
  return keys
    .map(k => (k in obj ? { [k]: obj[k] } : {}))
    .reduce((res, o) => Object.assign(res, o), {})
}
