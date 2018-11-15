import fileReader from 'pull-file-reader'

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
