import React from 'react'

export interface NodeInfoDetailProps {
  label: string
  value: string
}
export const NodeInfoDetail: React.FC<NodeInfoDetailProps> = ({ label, value }) => {
  return (
    <p>
      <span className='aqua'>{label}: </span><span>{value}</span>
    </p>
  )
}
