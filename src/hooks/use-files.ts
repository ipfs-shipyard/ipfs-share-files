import blobToIt from 'blob-to-it'
import { type Dispatch, useContext } from 'react'
import { type AddFileState, type FilesAction, FilesContext, FilesDispatchContext, type FilesState } from '../providers/files-provider'
import { type HeliaContextType } from '../providers/helia-provider'

export function useFiles (): FilesState {
  return useContext(FilesContext)
}

export function useFilesDispatch (): Dispatch<FilesAction> {
  return useContext(FilesDispatchContext)
}

export function useAddFiles (dispatch: Dispatch<FilesAction>, heliaState: HeliaContextType, filesState: FilesState) {
  if (heliaState.starting) {
    throw new Error('Helia not active')
  }
  const { mfs } = heliaState
  const isFirstAdd = Object.keys(filesState.files).length === 0

  return (files: File[]) => {
    // BUGFIX: clear MFS when UI state is empty to prevent sharing files from previous sessions.
    //
    // MFS is persisted in IndexedDB and survives page reloads and tab closes.
    // Without this clear, old files remain in MFS and get included in the share
    // link (which is generated from `mfs.stat('/')` CID covering ALL files in MFS root).
    //
    // NOTE: if this code is ever refactored, consider making UI state reflect MFS
    // state from the start, to avoid risk of generating share link with EXTRA
    // files from previous uploads that user is not aware of.
    const clearIfNeeded = isFirstAdd
      ? (async () => {
          for await (const entry of mfs.ls('/')) {
            await mfs.rm(`/${entry.name}`)
          }
        })()
      : Promise.resolve()

    for (const _file of files) {
      const name = _file.name

      clearIfNeeded.then(async () => {
        const content = blobToIt(_file)
        await mfs.writeByteStream(content, name)
        const { cid } = await mfs.stat(`/${name}`)

        const file: AddFileState = {
          id: cid.toString(),
          name,
          size: _file.size,
          progress: 0,
          cid,
          published: false
        }
        dispatch({ type: 'add_start', ...file })
        dispatch({ type: 'add_success', id: cid.toString(), cid })
        return cid
      }).catch((err: Error) => {
        console.error('error adding a file', err)
        // dispatch({ type: 'add_fail', id, error: err })
        throw err
      })
    }
  }
}
