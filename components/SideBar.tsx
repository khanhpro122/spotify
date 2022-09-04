import { HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import IconButton from './IconButton'
import { usePlaylistContext } from 'contexts/PlaylistContext'
import useSpotify from 'hooks/useSpotify'

const renderProp = [
    {
        icon: HomeIcon,
        text: 'Home'
    },
    {
        icon: SearchIcon,
        text: 'Search'
    },
    {
        icon: LibraryIcon,
        text: 'Your Library'
    },
    {
        icon: PlusCircleIcon,
        text: 'Create Playlist'
    },
    {
        icon: HeartIcon,
        text: 'Liked Songs'
    },
    {
        icon: RssIcon,
        text: 'Your episodes'
    },
]

const Divider = () => <hr className="border-t-[0.1px] border-gray-900"></hr>

const SideBar = () => {
  const spotifyApi = useSpotify()
  const { playListContextState: {playlists}, updatePlaylistContextState } = usePlaylistContext()

  const handleSetSelectedPlaylist = async (id: string) => {
    const playlist = await spotifyApi.getPlaylist(id)
    updatePlaylistContextState({
        selectedPlaylistId: id,
        selectedPlaylist: playlist.body
    })
}

  return (
    <div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm h-screen border-r border-gray-900 overflow-y-scroll scrollbar-hidden sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block">
        <div className='space-y-4'>
            {renderProp.map((item, index) => {
                return (
                    <Fragment key={item.text}>
                        {index === 4 && <Divider />}
                        <IconButton icon={item.icon} text={item.text}/>
                    </Fragment>
                )
            })}
            {playlists.map((playlist) => {
                return(
                    <p onClick={() => handleSetSelectedPlaylist(playlist.id)}
                    key={playlist.id} className="cursor-pointer hover:text-white">{playlist.name}</p>
                )
            })}
        </div>
    </div>
  )
}

export default SideBar