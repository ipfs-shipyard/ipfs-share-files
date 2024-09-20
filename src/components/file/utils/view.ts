const view = (url: string, fileName?: any) => {
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('target', '_blank')
  link.click()
}

export default view
