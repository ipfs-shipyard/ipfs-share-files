import { Dispatch, useContext } from "react"
import shortid from 'shortid'
import { AddFileState, FilesAction, FilesContext, FilesDispatchContext } from "../providers/FilesProvider"
import blobToIt from "blob-to-it"
import { HeliaContextType } from "../providers/HeliaProvider"

export function useFiles () {
  return useContext(FilesContext)
}

export function useFilesDispatch () {
  return useContext(FilesDispatchContext)
}

export function useAddFiles (dispatch: Dispatch<FilesAction>, heliaState: HeliaContextType) {
  if (heliaState.starting) {
    throw new Error('Helia not active')
  }
  const { helia, mfs } = heliaState

  return (files: File[]) => {
    for (const _file of files) {
      const id: string = shortid.generate()
      const name = _file.name

      const file: AddFileState = {
        id,
        name,
        size: _file.size,
        progress: 0,
        cid: null,
        pending: true,
        published: false,
      }

      Promise.resolve().then(async () => {
        dispatch({ type: 'add_start', ...file})
        const content = blobToIt(_file)
        await mfs.writeByteStream(content, name)
        const { cid } = await mfs.stat(`/${name}`)
        dispatch({ type: 'add_success', id: id, cid })
        return cid
      }).catch((err: Error) => {
        console.error(err)
        dispatch({ type: 'add_fail', id: id, error: err })
        throw err
      }).then(async (cid) => {
        dispatch({ type: 'publish_start', id: id })
        await helia.routing.provide(cid, {
          onProgress: (evt) => {
            console.info(`Publish progress "${evt.type}" detail:`, evt.detail)
          }
        })
        dispatch({ type: 'publish_success', id: id, cid })
      }).catch((err: Error) => {
        console.error(err)
        dispatch({ type: 'publish_fail', id: id, error: err })
      })
    }
  }
}