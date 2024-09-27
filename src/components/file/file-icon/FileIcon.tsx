import classNames from 'classnames'
import DocCalc from 'ipfs-css/icons/glyph_doc_calc.svg'
import Doc from 'ipfs-css/icons/glyph_doc_generic.svg'
import DocMovie from 'ipfs-css/icons/glyph_doc_movie.svg'
import DocMusic from 'ipfs-css/icons/glyph_doc_music.svg'
import DocPicture from 'ipfs-css/icons/glyph_doc_picture.svg'
import DocText from 'ipfs-css/icons/glyph_doc_text.svg'
import Folder from 'ipfs-css/icons/glyph_folder.svg'
import React, { type HTMLProps } from 'react'
import extToType from '../utils/extToType'

const typeFromExt = (filename: string): string | undefined => {
  const ext = filename.split('.').pop() ?? ''
  return extToType[ext] ?? ext
}

export interface FileIconProps extends HTMLProps<HTMLElement> {
  name: string
  type?: 'dir' | 'file'
  error?: Error
}

const FileIcon: React.FC<FileIconProps> = ({ className = '', name, type, error }) => {
  const iconColor = classNames(className, error != null ? 'fill-gray' : 'fill-aqua')
  const iconHeight = 40

  if (type === 'dir') {
    return <Folder className={iconColor} height={iconHeight} />
  }

  switch (typeFromExt(name)) {
    case 'audio':
      return <DocMusic className={iconColor} height={iconHeight} />
    case 'video':
      return <DocMovie className={iconColor} height={iconHeight} />
    case 'image':
      return <DocPicture className={iconColor} height={iconHeight} />
    case 'text':
      return <DocText className={iconColor} height={iconHeight} />
    case 'calc':
      return <DocCalc className={iconColor} height={iconHeight} />
    default:
      return <Doc className={iconColor} height={iconHeight} />
  }
}

export default FileIcon
