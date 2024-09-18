const download = (url, fileName) => {
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  // link.setAttribute()
  link.click()
}

export default download
