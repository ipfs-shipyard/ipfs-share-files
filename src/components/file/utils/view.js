const view = (url, fileName) => {
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('target', '_blank')
  link.click()
}

export default view
