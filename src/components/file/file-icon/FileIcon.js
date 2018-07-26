import React from 'react'
import fileExtension from 'file-extension'
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
  const style = { width: '2.5rem' }

  switch (typeFromExt(type)) {
    case 'directory':
      return <Folder className='fill-aqua' style={style} />
    case 'audio':
      return <DocMusic className='fill-aqua' style={style} />
    case 'video':
      return <DocMovie className='fill-aqua' style={style} />
    case 'image':
      return <DocPicture className='fill-aqua' style={style} />
    case 'text':
      return <DocText className='fill-aqua' style={style} />
    case 'calc':
      return <DocCalc className='fill-aqua' style={style} />
    default:
      return <Doc className='fill-aqua' style={style} />
  }
}

export default FileIcon
