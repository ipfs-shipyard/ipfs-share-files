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

const FileIcon = ({type}) => {
  const iconHeight = 40

  switch (typeFromExt(type)) {
    case 'directory':
      return <Folder className='fill-aqua' height={iconHeight} />
    case 'audio':
      return <DocMusic className='fill-aqua' height={iconHeight} />
    case 'video':
      return <DocMovie className='fill-aqua' height={iconHeight} />
    case 'image':
      return <DocPicture className='fill-aqua' height={iconHeight} />
    case 'text':
      return <DocText className='fill-aqua' height={iconHeight} />
    case 'calc':
      return <DocCalc className='fill-aqua' height={iconHeight} />
    default:
      return <Doc className='fill-aqua' height={iconHeight} />
  }
}

export default FileIcon
