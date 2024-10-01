import blobToIt from 'blob-to-it'
import { type Dispatch, useContext } from 'react'
import { type AddFileState, type FilesAction, FilesContext, FilesDispatchContext, type FilesState } from '../providers/FilesProvider'
import { type HeliaContextType } from '../providers/HeliaProvider'

export function useFiles (): FilesState {
  return useContext(FilesContext)
}

export function useFilesDispatch (): Dispatch<FilesAction> {
  return useContext(FilesDispatchContext)
}

export function useAddFiles (dispatch: Dispatch<FilesAction>, heliaState: HeliaContextType) {
  if (heliaState.starting) {
    throw new Error('Helia not active')
  }
  const { mfs } = heliaState

  return (files: File[]) => {
    for (const _file of files) {
      // const id: string = shortid.generate()
      const name = _file.name

      Promise.resolve().then(async () => {
        const content = blobToIt(_file)
        await mfs.writeByteStream(content, name)
        const { cid } = await mfs.stat(`/${name}`)

        const file: AddFileState = {
          id: cid.toString(),
          name,
          size: _file.size,
          progress: 0,
          cid,
          pending: true,
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
