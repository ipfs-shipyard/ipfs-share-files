export default (fileContent, fileName) => {
  const blob = new window.Blob([fileContent], { type: 'application/octet-binary' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.click()
}
