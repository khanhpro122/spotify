import { usePlaylistContext } from 'contexts/PlaylistContext'
import { useSongContext } from 'contexts/SongContext'
import useSpotify from 'hooks/useSpotify'
import Image from 'next/image'
import React from 'react'
import { SongReducerActionType } from 'types'
import { covertDuration } from 'utils/convertTime'

interface Props {
    item: SpotifyApi.PlaylistTrackObject,
    itemIndex: number
}

const Song = ({ item, itemIndex }: Props) => {
  const spotifyApi = useSpotify()
  const { songContextState: {deviceId}, dispatch} = useSongContext()
  const { playListContextState: {selectedPlaylist} } = usePlaylistContext()

  const handlePlaySong = async () => {
    console.log('okok')
    if(!deviceId) return
    dispatch({
        type: SongReducerActionType.SetCurrentPlayingSong,
        payload: {
            selectedSong: item.track,
            selectedSongId : item.track?.id,
            isPlaying: true
        }
    })

    await spotifyApi.play({
        device_id: deviceId,
        context_uri: selectedPlaylist?.uri,
        offset: {
            uri: item.track?.uri as string
        }
    })
  }

  return (
    <div className='grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer' onClick={handlePlaySong}>
        <div className='flex items-center space-x-4'>
            <p>{itemIndex + 1}</p>
            <div>
                <Image src={item?.track?.album?.images[0].url || ''} alt="track over" height="40px" width="40px" />
            </div>
            <div>
                <p className='2-46 lg:w-72 truncate text-white'>{item?.track?.name}</p>
                <p className='w-40'>{item?.track?.artists[0].name}</p>
            </div>
        </div>
        <div className='flex justify-between items-center ml-auto md:ml-0'>
            <p className='hidden md:block w-40'>{item?.track?.album.name}</p>
            <p>{covertDuration(item?.track?.duration_ms || 0)}</p>
        </div>
    </div>
  )
}

export default Song