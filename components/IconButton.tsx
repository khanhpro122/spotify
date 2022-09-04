import React from 'react'

interface Props {
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element,
    text: string
}

const IconButton = ({icon: Icon, text}: Props) => {
  return (
    <button className='flex items-center space-x-2 hover:text-white'>
        <Icon className='icon'/>
        <span>{text}</span>
    </button>
  )
}

export default IconButton