import toBrowserReadableStream from 'it-to-browser-readablestream'

/**
 * This function takes an async iterable, and creates a file object that
 * does not load the full content of the AsyncIterable into memory.
 *
 * @param {AsyncIterable<Uint8Array>} asyncIt
 * @returns {Promise<File>}
 */
export async function asyncItToFile (asyncIt, filename) {
  const stream = toBrowserReadableStream(asyncIt)
  const responseFromStream = new Response(stream)
  const blob = await responseFromStream.blob()

  return new File([blob], filename, { type: blob.type })
}
