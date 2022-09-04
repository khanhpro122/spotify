import type { NextPage } from 'next'
import Head from 'next/head'
import Center from 'components/Center'
import SideBar from 'components/SideBar'
import { PlaylistContextProvider } from 'contexts/PlaylistContext'
import Player from '@components/Player'
import SongContextProvider from 'contexts/SongContext'


const Home: NextPage = () => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <PlaylistContextProvider>
        <SongContextProvider>
          <Head>
            <title>Spotify</title>
            <meta name="description" content='Spotify by Henry Web Dev' />
            <link ref={`icon`} href='/favicon.ico' />
          </Head>
          <main className='flex'>
            <SideBar />
            <Center />
          </main>
          <div className='sticky bottom-0 text-white'>
            <Player />
          </div>
        </SongContextProvider>
      </PlaylistContextProvider>
    </div>
  )
}

export default Home
