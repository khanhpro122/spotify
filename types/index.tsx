import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Dispatch } from "react";

export enum TokenErr {
    RefreshAccessTokenErr = 'RefreshAccessTokenErr'
}

export interface ExtendedToken extends JWT {
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresAt: number,
    user: User,
    err?: TokenErr
}

export interface ExtendedSession extends Session {
    accessToken: ExtendedToken['accessToken'];
    err: ExtendedToken['err']
}

export interface PlaylistContextState {
    playlists: SpotifyApi.PlaylistObjectSimplified[],
    selectedPlaylistId: string | null,
    selectedPlaylist: SpotifyApi.SinglePlaylistResponse | null
}

export interface IplayListContextState {
    playListContextState : PlaylistContextState,
    updatePlaylistContextState:  (updateObj: Partial<PlaylistContextState>) => void
}

export interface SongContextState {
    selectedSongId?: string;
    selectedSong: SpotifyApi.TrackObjectFull | null;
    isPlaying: boolean,
    volumn: number,
    deviceId: string | null
}

export interface ISongContext {
    songContextState: SongContextState,
    dispatchSongContext: Dispatch<SongReducerAction>
}

export enum SongReducerActionType {
    SetDevice = 'SetDevice',
    ToggleIsPlaying = 'ToggleIsPlaying',
    SetCurrentPlayingSong = 'SetCurrentPlayingSong',
    SetVolumn = 'SetVolumn'
}

export type SongReducerAction = 
| {
    type : SongReducerActionType.SetDevice,
    payload: Pick<SongContextState, 'deviceId' | 'volumn'>
} | {
    type: SongReducerActionType.ToggleIsPlaying,
    payload: boolean
} | {
    type: SongReducerActionType.SetCurrentPlayingSong,
    payload: Pick<SongContextState, 'selectedSong' | 'selectedSongId' | 'isPlaying'>
} | {
    type: SongReducerActionType.SetVolumn,
    payload: number
}