import { scopes, spotifyApi } from "config/spotify";
import nextAuth, { CallbacksOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify'
import { ExtendedToken, TokenErr } from "types";

const refreshAcessToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
    try{
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            refreshToken: refreshedToken.refresh_token || token.refreshToken,
            accessTokenExpiresAt: Date.now() + refreshedToken.expires_in * 1000
        }
    }catch(err){
        return {
            ...token,
            err: TokenErr.RefreshAccessTokenErr 
        }
    }
}

const jwtCallback: CallbacksOptions['jwt'] = async ({ token, account, user }) => {
    let extendedToken : ExtendedToken

    if(account && user) {
        extendedToken = {
            ...token,
            user,
            accessToken: account.access_token as string,
            refreshToken: account.refresh_token as string,
            accessTokenExpiresAt: (account.expires_at as number) * 1000
        }
        return extendedToken
    }
    if(Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt){
        return token
    }
    return await refreshAcessToken(token as ExtendedToken)
}

const sessionCallback: CallbacksOptions['session'] = async ({session, token}) => {
    session.accessToken = (token as ExtendedToken).accessToken
    session.error = (token as ExtendedToken).err
    return session
}

export default nextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                url: 'https://accounts.spotify.com/authorize',
                params: {
                    scope: scopes
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        jwt: jwtCallback,
        session: sessionCallback
    }
})