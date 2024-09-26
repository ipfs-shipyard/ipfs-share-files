import toBrowserReadableStream from 'it-to-browser-readablestream'

/**
 * This function takes an async iterable, and creates a file object that
 * does not load the full content of the AsyncIterable into memory.
 */
export async function asyncItToFile (asyncIt: AsyncIterable<Uint8Array>, filename: string): Promise<File> {
  const stream = toBrowserReadableStream(asyncIt)
  const responseFromStream = new Response(stream)
  const blob = await responseFromStream.blob()

  return new File([blob], filename, { type: blob.type })
}
