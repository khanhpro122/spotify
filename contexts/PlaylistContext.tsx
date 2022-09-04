import useSpotify from "hooks/useSpotify";
import { useSession } from "next-auth/react";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { IplayListContextState, PlaylistContextState } from "types";

const defaultPlaylistContextState:PlaylistContextState = {
    playlists: [],
    selectedPlaylistId: null,
    selectedPlaylist: null
}

export const PlaylistContext = createContext<IplayListContextState>({
    playListContextState : defaultPlaylistContextState,
    updatePlaylistContextState: () => {}
})

export const usePlaylistContext = () => useContext(PlaylistContext)

export const PlaylistContextProvider = ({children}: {children: ReactNode}) => {
    const [playListContextState, setPlayListContextState] = useState(defaultPlaylistContextState)
    const {data: session} = useSession()
    const spotifyApi = useSpotify()

    const updatePlaylistContextState = (updateObj: Partial<PlaylistContextState>) => {
        setPlayListContextState(prevState => ({
            ...prevState,
            ...updateObj
        }))
    }
    
    useEffect(() => {
        const getUserPlaylists = async () => {
            const userPlaylistResponse = await spotifyApi.getUserPlaylists()
            updatePlaylistContextState({playlists: userPlaylistResponse.body.items})
        }
        if(spotifyApi.getAccessToken()){
            getUserPlaylists()
        }
    }, [spotifyApi, session])
    
    const playlistContextProviderData = {
        playListContextState,
        updatePlaylistContextState
    }

    return <PlaylistContext.Provider value={playlistContextProviderData}>
        {children}
    </PlaylistContext.Provider>
}