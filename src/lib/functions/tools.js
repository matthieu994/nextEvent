import moment from "moment"

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

export const displayDate = (date, format = "dddd D MMMM YYYY à HH:mm") => {
  moment.locale("fr")
  return moment(date).format(format)
}

export const displayName = user => {
  return `${user.displayName} ${user.familyName}`
}

export const listenerFunction = (snapshot, initPayments) => {
  let payments = initPayments
  snapshot.docChanges.forEach(s => {
    if (s.type === "added" && !payments.find(p => p.id === s.doc.id))
      payments.push({ id: s.doc.id, properties: s.doc.data() })
    else if (s.type === "modified") {
      payments.find(p => p.id === s.doc.id).properties = s.doc.data()
    } else if (s.type === "removed") {
      payments.splice(payments.findIndex(p => p.id === s.doc.id), 1)
    }
  })
  return sortArray(payments, "date")
}
