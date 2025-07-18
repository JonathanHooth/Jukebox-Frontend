import {
  ClubListSchema,
  ClubMembershipSchema,
  ClubMembershipsSchema,
  ClubSchema,
  JukeboxListSchema,
  JukeboxSchema,
  SpotifyAccountSchema,
  SpotifyAuthRedirectUrlSchema,
  SpotifyLinksSchema,
  UserDetailsSchema,
} from 'src/schemas'
import { deleteTrackListResult, deleteTrackResultSchema, QueuedTrackListSchema, swapTrackSchema, TrackListResult } from 'src/schemas/player'
import {
  getRandomSample,
  mockClubs,
  mockJukeboxes,
  mockQueuedTracks,
  mockSpotifyAccount,
  mockUser,
} from 'src/utils'
import { mockPlayerQueueState } from './../utils/mock/mock-spotify'
import { NetworkBase } from './NetworkBase'
import { mockMembership, mockMemberships } from 'src/utils/mock/mock-memberships'

/**
 * Handle API requests to connected servers.
 */
export class Network extends NetworkBase {
  private static instance: Network

  private constructor() {
    super()
  }

  /**
   * Ensures there only exists one instance
   * of this class.
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new this()
    }

    return this.instance
  }

  /*=== Club & User Routes ================================*/
  /**
   * Fetch details for logged in user.
   */
  public async getCurrentUser() {
    const url = this.endpoints.user.info

    return await this.request(url, UserDetailsSchema, {
      mock: { data: mockUser },
    })
  }

  /**
   * Fetch a list of clubs user is member of.
   */
  public async listClubs() {
    const url = this.endpoints.club.list

    return await this.request(url, ClubListSchema, {
      mock: { data: mockClubs },
    })
  }

  /**
   * Fetch details for a club.
   */
  public async getClub(id: number) {
    const url = this.endpoints.club.get(id)

    return await this.request(url, ClubSchema, {
      mock: {
        data: mockClubs.find((club) => club.id === id),
        errorIfEmpty: true,
      },
    })
  }

  /*=== Jukebox Routes ====================================*/
  /**
   * Get account info for the active spotify account
   * linked to the Jukebox. This includes the necessary
   * access tokens to initialize the web player.
   */
  public async getSpotifyAuth(jukeboxId: number) {
    const url = this.endpoints.jukebox.getSpotifyAccount(jukeboxId)

    return await this.request(url, SpotifyAccountSchema, {
      mock: { data: mockSpotifyAccount, errorIfEmpty: true },
    })
  }

  /**
   * Fetch jukeboxes for clubs the user is a member of.
   *
   * The backend will check which clubs/jukeboxes
   * will make up the list for the user that is
   * connected to the auth token sent in the request.
   */
  public async listJukeboxes() {
    const url = this.endpoints.jukebox.list

    return await this.request(url, JukeboxListSchema, {
      mock: { data: mockJukeboxes },
    })
  }

  /**
   * Change the active device controlling playback
   * for Spotify.
   */
  public async connectSpotifyDevice(jukeboxId: number, deviceId: string) {
    const url = this.endpoints.jukebox.connectDevice(jukeboxId)

    return await this.request(url, null, {
      method: 'POST',
      data: { device_id: deviceId },
    })
  }

  /**
   * Set a linked account as active for a jukebox.
   *
   * This will determine whose account is used when
   * managing the player state.
   */
  public async updateActiveJukeboxLink(jukeboxId: number, link: IJukeboxLink) {
    const url = this.endpoints.jukebox.activeLink(jukeboxId)

    return await this.request(url, null, {
      method: 'POST',
      data: { type: link.type, email: link.email },
    })
  }

  /**
   * Get the current player state for a jukebox,
   * includes the player queue.
   *
   * Throws a 404 error if nothing is playing.
   */
  public async getCurrentlyPlaying(jukeboxId: number) {
    const url = this.endpoints.jukebox.playerState(jukeboxId)

    return await this.request(url, null, {
      mock: { data: mockPlayerQueueState },
    })
  }

  /**
   * Get the next tracks that are queued up.
   * Excludes the current track.
   */
  public async getNextTracks(jukeboxId: number) {
    const url = this.endpoints.jukebox.nextTracks(jukeboxId)

    return await this.request(url, QueuedTrackListSchema, {
      mock: { data: getRandomSample(mockQueuedTracks) },
    })
  }

  /**
   * Clears the track queue for next tracks.
   */
  public async clearNextTracks(jukeboxId: number) {
    const url = this.endpoints.jukebox.nextTracks(jukeboxId)

    return await this.request(url, null, { method: 'DELETE' })
  }

  /**
   *
   */
  public async getSpotifyAuthRedirectUrl(jukeboxId?: number) {
    const url = this.endpoints.spotify.login(location.href, jukeboxId)
    console.log(url)
    const response = await this.request(url, SpotifyAuthRedirectUrlSchema)
    console.log(response)
    return response
  }

  public async createJbx(jbxId: number, jbxName: string) {
    const url = this.endpoints.jukebox.list
    const res = await this.request(url, null, {
      method: 'POST',
      data: { name: jbxName, club_id: jbxId },
    })

    return res
  }

  /**
   *  Creates a new Jukebox
   *  TODO: fix schema type
   */
  public async createJukebox(
    jukeboxId: number,
    jukeboxName: string,
    spotifyLink?: ISpotifyLink[],
  ) {
    const res = await this.createJbx(jukeboxId, jukeboxName)

    const url = this.endpoints.jukebox.links(jukeboxId)
    if (spotifyLink !== undefined && spotifyLink.length !== 0) {
      spotifyLink.forEach(async (link) => {
        const res = await this.request(url, null, {
          method: 'POST',
          data: { type: link.token_type, email: link.spotify_email },
        })
      })
    }

    return res
  }

  public async getLinks() {
    /**
     * const url = this.endpoints.jukebox.getSpotifyAccount(jukeboxId)

    return await this.request(url, SpotifyAccountSchema, {
      mock: { data: mockSpotifyAccount, errorIfEmpty: true },
    })
     */
    const url = this.endpoints.spotify.links

    //const response = await this.request(url)

    const response = await this.request(url, SpotifyLinksSchema)
    //console.log(response);
    return response
  }

  public async getTracks(
    jukeboxId: number,
    trackName: string,
    albumName: string,
    artistName: string,
  ) {
    const url = this.endpoints.jukebox.search(jukeboxId)

    const response = await this.request(url, TrackListResult, {
      method: 'POST',
      data: { trackQuery: trackName, albumQuery: albumName, artistQuery: artistName },
    })

    return response
  }

  public async queueTrack(jukeboxId:number, songID:string){
    const url = this.endpoints.jukebox.queue(jukeboxId)

    const response = await this.request(url, null, {
      method: 'POST',
      data: {track_id: songID, position: 100}
    })
  }

  /**
   * 
   * @param clubID 
   * @returns List of members for a given club
   */
  public async getMembers(clubID: number) {
    const url = this.endpoints.club.members(clubID)

    const response = await this.request(url, ClubMembershipsSchema)

    return response
  }

  public async listJukebox(jukeboxId: number) {
    const url = this.endpoints.jukebox.getJbk(jukeboxId)

    const response = await this.request(url, JukeboxSchema)

    return response
  }

  public async listClubJukeboxes(clubId: number) {
    const url = this.endpoints.jukebox.getClubList(clubId)

    return await this.request(url, JukeboxListSchema, {
      mock: { data: mockJukeboxes },
    })
  }

  public async removeQueuedTrack(jukeboxId: number, queueId: string) {
    const url = this.endpoints.jukebox.removeQTrack(jukeboxId, queueId)

    const response = await this.request(url, deleteTrackListResult, {
      method: 'DELETE',
    })

    return response
  }

  public async swapTracks(jukeboxId: number, currentPosition: number, targetPosition: number) {
    const url = this.endpoints.jukebox.swapTracks(jukeboxId)
    const response = await this.request(url, swapTrackSchema, {
      method: 'POST',
      data: {currentPos: currentPosition, targetPos:  targetPosition}
    })

    return response
  }

  public async getCurrentMembership(clubId: number, memberId: number){
    const url = this.endpoints.club.membership(clubId, memberId)

    const response = await this.request(url, ClubMembershipSchema, {
      mock: { data: mockMembership },
  })
    console.log(response)
    return response
  }

}
