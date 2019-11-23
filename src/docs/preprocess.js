function deepProcess (target, func) {
  if (typeof target === 'object') {
    const resultObj = {}
    Object.keys(target).forEach(key => {
      resultObj[key] = deepProcess(target[key], func)
    })
    return resultObj
  }

  return func(target)
}

function removeNewLine (text) {
  return text.replace(/\s*\n\s*/g, '')
}

export function interpolate (text, params = {}) {
  let result = text
  Object.keys(params).forEach(key => {
    result = result.replace(new RegExp(`{{ ${key} }}`, 'gi'), params[key])
  })
  return result
}

export function deepRemoveNewLine (target) {
  return deepProcess(target, removeNewLine)
}
