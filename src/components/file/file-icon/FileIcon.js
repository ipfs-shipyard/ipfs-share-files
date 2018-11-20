import React from 'react'
import fileExtension from 'file-extension'

// Utils
import extToType from '../utils/extToType'

// Static
import Folder from '../../../media/icons/GlyphFolder'
import Doc from '../../../media/icons/GlyphDocGeneric'
import DocMovie from '../../../media/icons/GlyphDocMovie'
import DocCalc from '../../../media/icons/GlyphDocCalc'
import DocMusic from '../../../media/icons/GlyphDocMusic'
import DocPicture from '../../../media/icons/GlyphDocPicture'
import DocText from '../../../media/icons/GlyphDocText'

const typeFromExt = (filename) => {
  const ext = fileExtension(filename)
  return extToType[ext] || ext
}

const FileIcon = ({name, type, error}) => {
  const iconColor = error ? 'fill-gray' : 'fill-aqua'
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
