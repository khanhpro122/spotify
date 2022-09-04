import { SongContextState, SongReducerAction, SongReducerActionType } from "types";

export const songReducer = (state: SongContextState,{ type, payload }: SongReducerAction):SongContextState => {
    console.log('type', type)
    switch(type){
        case SongReducerActionType.SetDevice:
            return {
                ...state,
                deviceId: payload.deviceId,
                volumn: payload.volumn
            }
        case SongReducerActionType.ToggleIsPlaying:
            return {
                ...state,
                isPlaying: payload
            }
        case SongReducerActionType.SetCurrentPlayingSong:
            return {
                ...state,
                selectedSongId: payload.selectedSongId,
                selectedSong: payload.selectedSong,
                isPlaying: payload.isPlaying
            }
        case SongReducerActionType.SetVolumn:
            return {
                ...state,
                volumn: payload
            }
        default:
            return state
    }
}