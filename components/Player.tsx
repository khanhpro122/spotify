import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeUpIcon } from '@heroicons/react/outline'
import { useSongContext } from 'contexts/SongContext'
import useSpotify from 'hooks/useSpotify'
import Image from 'next/image'
import React, { ChangeEventHandler } from 'react'
import { SongReducerActionType } from 'types'
import { useDebouncedCallback } from 'use-debounce'

const Player = () => {
  const spotifyApi= useSpotify()
  const { songContextState: { volumn, selectedSong, selectedSongId, isPlaying, deviceId }, dispatchSongContext} = useSongContext()
  
  const handlePlayPause = async () => {
    const response = await spotifyApi.getMyCurrentPlaybackState()
    if(!response.body) return

    if(response.body.is_playing) {
        ({
            type: SongReducerActionType.ToggleIsPlaying,
            payload: false
        })
        await spotifyApi.pause()
    } else {
        await spotifyApi.play()
        dispatchSongContext({
            type: SongReducerActionType.ToggleIsPlaying,
            payload: true
        })
    }
  }

  const debouncedAdjustVolumn = useDebouncedCallback((volumn: number) => {
    spotifyApi.setVolume(volumn)
  }, 500)

  const handleOnchangeVolumn : ChangeEventHandler<HTMLInputElement> = (e) => {
    const volumn = Number(e.target.value)
    if(!deviceId) return 
    debouncedAdjustVolumn(volumn)
    
    dispatchSongContext({
        type: SongReducerActionType.SetVolumn,
        payload: volumn
    })
  }
  
  const handleSkipSong = async (skipTo: 'previous' | 'next') => {
    if(!deviceId) return
    if(skipTo === 'previous') {
        await spotifyApi.skipToPrevious()
    }else {
        await spotifyApi.skipToNext()
    }
    const songInfo = await spotifyApi.getMyCurrentPlayingTrack()
    if(!songInfo.body) return

    dispatchSongContext({
        type: SongReducerActionType.SetCurrentPlayingSong,
        payload: {
            selectedSongId: songInfo.body.item?.id,
            selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
            isPlaying: songInfo.body.is_playing
        }
    })
  }

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div className='flex items-center space-x-4'>
            {selectedSong && (
                <>
                    <div className='hidden md:block'>
                        <Image src={selectedSong.album.images[0].url} alt={`Album cover fot ${selectedSong.name}`} height="40px" width="40ox" />    
                    </div> 
                    <div>
                        <h3>{selectedSong.name}</h3>
                        <p>{selectedSong.artists[0].name}</p>
                    </div>
                </>
            )}
        </div>
        <div className='flex justify-evenly items-center'>
            <SwitchHorizontalIcon className='icon-playback' />
            <RewindIcon className='icon-playback' onClick={handleSkipSong.bind(this, 'previous')}/>
            {
                isPlaying ? (
                    <PauseIcon className='icon-playback' onClick={handlePlayPause}/>
                ) : (
                    <PlayIcon className='icon-playback' onClick={handlePlayPause} />
                )
            }
            <FastForwardIcon className='icon-playback' onClick={handleSkipSong.bind(this, 'next')}/>
            <ReplyIcon className='icon-playback' />
        </div>
        <div className='flex justify-end items-center pr-5 space-x-3 md:space-x-4'>
            <VolumeUpIcon className='icon-playback' />
            <input type='range' min={0} max={100} className='w-20 md:w-auto' value={volumn} onChange={handleOnchangeVolumn} />
        </div>
    </div>
  )
}

export default Player