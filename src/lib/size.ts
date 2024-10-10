export function formatBytes(bytes: number, decimals = 0): string {
  if (!+bytes) return '0 Bytes' // checks if bytes is zero, NaN, or any falsy value

  const k = 1024 // constant for the base of the exponentiation
  const dm = decimals < 0 ? 0 : decimals // determines the number of decimal places to display
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] // array of size units

  const i = Math.floor(Math.log(bytes) / Math.log(k)) // calculates the appropriate size unit index

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}` // formats the size with the appropriate unit
}
