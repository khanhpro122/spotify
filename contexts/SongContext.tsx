import useSpotify from "hooks/useSpotify"
import { useSession } from "next-auth/react"
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react"
import { songReducer } from "reducers/songReducer"
import { ISongContext, SongContextState, SongReducerActionType } from "types"

const defaultSongContextState:SongContextState = {
    selectedSongId: undefined,
    selectedSong: null,
    isPlaying: false,
    volumn: 50,
    deviceId: null
}

export const SongContext = createContext<ISongContext>({
    songContextState : defaultSongContextState,
    dispatchSongContext: () => {}
})

export const useSongContext = () => useContext(SongContext)

const SongContextProvider = ({children}: {children: ReactNode}) => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()
    const [songContextState, dispatchSongContext] = useReducer(songReducer, defaultSongContextState) 
    useEffect(() => {
        const setCurrentDevice = async () => {
            const availableDeviceResponse = await spotifyApi.getMyDevices()
            if(!availableDeviceResponse.body.devices.length) return
            const {id : deviceId, volume_percent } = availableDeviceResponse.body.devices[0]
            dispatchSongContext({
                type: SongReducerActionType.SetDevice,
                payload: {
                    deviceId,
                    volumn: volume_percent as number
                }
            })

            await spotifyApi.transferMyPlayback([deviceId as string])
        }
        if(spotifyApi.getAccessToken()) {
            setCurrentDevice()
        }
    },[spotifyApi, session])

    useEffect(() => {
        const getCurrentPlayingSong= async () => {
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
        if(spotifyApi.getAccessToken()) {
            getCurrentPlayingSong()
        }
    }, [spotifyApi, session])

    const songContextProviderData = {
        songContextState,
        dispatchSongContext
    }
    return <SongContext.Provider value={songContextProviderData}>{children}</SongContext.Provider>
}

export default SongContextProvider