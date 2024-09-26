import classNames from 'classnames'
import fileExtension from 'file-extension'
import React, { type HTMLProps } from 'react'
import DocCalc from '../../../media/icons/GlyphDocCalc'
import Doc from '../../../media/icons/GlyphDocGeneric'
import DocMovie from '../../../media/icons/GlyphDocMovie'
import DocMusic from '../../../media/icons/GlyphDocMusic'
import DocPicture from '../../../media/icons/GlyphDocPicture'
import DocText from '../../../media/icons/GlyphDocText'
import Folder from '../../../media/icons/GlyphFolder'
import extToType from '../utils/extToType'

const typeFromExt = (filename: string): string => {
  const ext = fileExtension(filename)
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
