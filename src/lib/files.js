export async function makeCIDFromFiles (files, ipfs) {
  let cid = await ipfs.object.new({ template: 'unixfs-dir' })

  for (const file of files) {
    cid = await ipfs.object.patch.addLink(cid, {
      name: file.name,
      size: file.size,
      cid: file.cid
    })
  }

  return cid
}
