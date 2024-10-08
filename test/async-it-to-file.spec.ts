import { unixfs, type UnixFS } from '@helia/unixfs'
import { stop } from '@libp2p/interface'
import { expect } from 'aegir/chai'
import loadFixtures from 'aegir/fixtures'
import { createHelia, type Helia } from 'helia'
import { equals } from 'uint8arrays/equals'
import { isNode } from 'wherearewe'
import { asyncItToFile } from '../src/components/file/utils/async-it-to-file.js'

async function fileToUint8Array (file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result))
      } else {
        reject(new Error('reader.result is not an ArrayBuffer'))
      }
    }
    reader.onerror = (err: any) => {
      reject(new Error(`reader.onerror: ${err}`))
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Do not run these tests in node.js
 */
const describeWrapper = !isNode ? describe : describe.skip

describeWrapper('async it to file', () => {
  let helia: Helia
  let ufs: UnixFS

  beforeEach(async () => {
    helia = await createHelia()
    ufs = unixfs(helia)
  })

  afterEach(async () => {
    await stop(helia)
  })

  it('returns the same bytes', async () => {
    const filename = 'package.json'
    // load package.json into helia
    const file = loadFixtures('package.json')
    const cid = await ufs.addFile({ content: file, path: filename })

    // now create the file object
    const fileFromHelia = await asyncItToFile(ufs.cat(cid), filename)

    const nativeUint8Array = new Uint8Array(file)

    const heliaUint8Array = await fileToUint8Array(fileFromHelia)

    // now compare file and fileFromHelia
    expect(equals(nativeUint8Array, heliaUint8Array)).to.be.true()
  })
})
