import { spotifyApi } from "config/spotify";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { ExtendedSession, TokenErr } from "types";

const useSpotify = () => {
    const { data: session } = useSession()
    useEffect(() => {
        if(!session) return
        if((session as ExtendedSession).err === TokenErr.RefreshAccessTokenErr){
            signIn()
        }
        spotifyApi.setAccessToken((session as ExtendedSession).accessToken)
    }, [session])

    return spotifyApi
}

export default useSpotify