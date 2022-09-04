import { usePlaylistContext } from 'contexts/PlaylistContext'
import React from 'react'
import Song from './Song'

const Songs = () => {
  const { playListContextState: {selectedPlaylist} } = usePlaylistContext()
  if(!selectedPlaylist) return null
  return (
    <div className='flex flex-col space-y1 px-8 pb-28'>
        {
            selectedPlaylist.tracks.items.map((item,index) =>{
                return (
                    <Song key={Math.random()} item={item} itemIndex={index} />
                )
            })
        }
    </div>
  )
}

export default Songs