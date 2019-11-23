const partisanIdentifiers = {
  '1': ['ichika', '一花'],
  '2': ['nino', '二乃'],
  '3': ['miku', '三玖'],
  '4': ['yotsuba', '四葉'],
  '5': ['itsuki', '五月']
}

function partisanIdentify (user) {
  const { name, description } = user

  const counts = {}

  Object.keys(partisanIdentifiers).forEach(partisan => {
    counts[partisan] = 0

    partisanIdentifiers[partisan].forEach(identifier => {
      const nameMatch = name.match(new RegExp(identifier, 'gi'))
      const descMatch = description.match(new RegExp(identifier, 'gi'))

      if (nameMatch !== null) {
        counts[partisan] += nameMatch.length
      }
      if (descMatch !== null) {
        counts[partisan] += descMatch.length
      }
    })
  })

  const maxCount = Math.max(...Object.values(counts))

  // unpartisan
  if (maxCount === 0) {
    return 0
  }

  // multiple maximum, return length + 1
  if (Object.values(counts).filter(c => c === maxCount).length > 1) {
    return Object.keys(counts).length + 1
  }

  return parseInt(Object.keys(counts).find(key => counts[key] === maxCount))
}

module.exports = {
  partisanIdentifiers,
  partisanIdentify
}
