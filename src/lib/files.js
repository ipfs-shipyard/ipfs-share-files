import fileReader from 'pull-file-reader'
import ENDPOINTS from '../constants/endpoints'

export async function filesToStreams (files) {
  if (files.hasOwnProperty('content')) {
    // this is a promise
    return files.content
  }

  const streams = []
  let totalSize = 0
  let isDir = false

  for (let file of files) {
    const stream = fileReader(file)

    if (file.webkitRelativePath) {
      isDir = true
    }

    streams.push({
      name: file.webkitRelativePath || file.name,
      content: stream,
      size: file.size
    })

    totalSize += file.size
  }

  return { streams, totalSize, isDir }
}

async function downloadSingle (file) {
  let url, filename

  if (file.type === 'directory') {
    url = `${ENDPOINTS.api}/v0/get?arg=${file.hash}&archive=true&compress=true`
    filename = `${file.name}.tar.gz`
  } else {
    url = `${ENDPOINTS.gateway}/${file.hash}`
    filename = file.name
  }

  return { url, filename }
}

export async function makeHashFromFiles (files, ipfs) {
  let node = await ipfs.object.new('unixfs-dir')

  for (const file of files) {
    node = await ipfs.object.patch.addLink(node.toJSON().multihash, {
      name: file.name,
      size: file.size,
      multihash: file.hash
    })
  }

  return node.toJSON().multihash
}

async function downloadMultiple (files, ipfs) {
  const multihash = await makeHashFromFiles(files, ipfs)

  return {
    url: `${ENDPOINTS.api}/v0/get?arg=${multihash}&archive=true&compress=true`,
    filename: `download_${multihash}.tar.gz`
  }
}

export async function getDownloadLink (files, ipfs) {
  if (files.length === 1) {
    return downloadSingle(files[0])
  }

  return downloadMultiple(files, ipfs)
}
