import * as fileType from '@sgtpooki/file-type'
import toBrowserReadableStream from 'it-to-browser-readablestream'
/**
 * This function takes an async iterable, and creates a file object that
 * does not load the full content of the AsyncIterable into memory.
 */
export async function asyncItToFile (asyncIt: AsyncIterable<Uint8Array>, filename: string): Promise<File> {
  const stream = toBrowserReadableStream(asyncIt)
  const responseFromStream = new Response(stream)
  const blob = await responseFromStream.blob()

  const type = await fileType.fileTypeFromBlob(blob)
  // console.log('file type', type)

  if (type?.ext != null && !filename.endsWith(`.${type.ext}`)) {
    /**
     * In cases where only a CID is shared, the filename may not have an extension.. if we have one, use it so the file is more easily opened.
     */
    filename = `${filename}.${type.ext}`
  }

  let blobType = type?.mime
  if (type?.ext === 'txt' || filename.endsWith('.txt')) {
    blobType = 'text/plain'
  }

  return new File([blob], filename, { type: blobType })
}
