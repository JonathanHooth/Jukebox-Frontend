/** Full track info returned from Spotify API */
declare type IFullTrack = Track

/** Type of track returned from the web player */
declare type ITrack = Spotify.Track

declare interface ITrackMeta extends ITrack {
  queue_id: string
  recommended_by?: string
  spotify_queued?: boolean
  likes?: number
  dislikes?: number
}

declare interface ISpotifyAccount extends IModel {
  access_token: string
  user_id: number
  spotify_email: string
  expires_in: number
  expires_at: number
  token_type: string
}

declare interface IPlayerState {
  jukebox_id: number
  current_track?: ITrack
  progress?: number
  is_playing: boolean
}

/**
 * State of the current player stored in Redis
 */
declare interface IPlayerMetaState extends IPlayerState {
  current_track?: ITrackMeta
  /** Next up in Spotify's queue */
  default_next_tracks: ITrack[]
}

/**
 * The state of the player broadcast to socket subscribers
 */
declare interface IPlayerQueueState extends IPlayerMetaState {
  /** Tracks queued up in server */
  next_tracks: ITrack[]
}

declare interface IPlayerAuxUpdate extends IPlayerState {
  changed_tracks?: boolean
  default_next_tracks: ITrack[]
}

declare interface IPlayerMetaUpdate extends Partial<IPlayerMetaState> {
  jukebox_id: number
}
type IPlayerUpdate = IPlayerQueueState

declare interface IPlayerAction extends Partial<IPlayerState> {
  current_track?: Partial<ITrackMeta>
}
