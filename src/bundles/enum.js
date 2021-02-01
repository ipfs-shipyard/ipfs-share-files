export const from = (variants) => variants.reduce((result, key) => {
    result[key] = key
    return result
  }, Object.create(null))
  