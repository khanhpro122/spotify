import { usePlaylistContext } from 'contexts/PlaylistContext'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import User from 'assets/user.png'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { pickRandom } from 'utils/pickRandomColors'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

const Center = () => {
  const { playListContextState: {selectedPlaylist, selectedPlaylistId} } = usePlaylistContext()
  const { data: session } = useSession()
  const [fromColor, setFromColors] = useState<string | null>(null)

  useEffect(() => {
    setFromColors(pickRandom(colors))
  }, [selectedPlaylistId])

  return (
    <div className='text-white flex-grow relative h-screen overflow-y-scroll scrollbar-hidden'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 rounded-full py-1 pl-1 pr-2'
          onClick={() => {
            signOut()
          }}
        >
          <Image src={session?.user?.image || User} alt="User Avatar" height="40px" width="40px" className="rounded-full object-cover"/>
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className='icon'/>
        </div>
      </header>
      <section className={`flex items-end space-x-7 bg-gradient-to-b ${fromColor} to-black h-80 p-8`}>
          {
            selectedPlaylist && (
              <>
                <Image src={selectedPlaylist.images[0].url} alt='Playlist Umage' height="176px" width="176px" className="shadow-2xl"/>
                <div>
                  <p>PLAYLIST</p>
                  <h1 className='text-2xl font-bold md:text-3xl xl:text-5xl'>
                    {selectedPlaylist?.name}
                  </h1>
                </div>
              </>
            )
          }
      </section>
      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center