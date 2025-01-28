import { createAsyncThunk } from '@reduxjs/toolkit'
import { Network } from 'src/network'

const network = Network.getInstance()

export const thunkFetchJukeboxes = createAsyncThunk(
  'jukebox/fetchJukeboxes',
  async () => {
    return await network.sendGetJukeboxes()
  },
)

export const thunkFetchCurrentlyPlaying = createAsyncThunk(
  'jukebox/fetchCurrentlyPlaying',
  async (jukeboxId: number) => {
    return await network.sendGetCurrentlyPlaying(jukeboxId)
  },
)

export const thunkFetchNextTracks = createAsyncThunk(
  'jukebox/fetchNextTracks',
  async (jukeboxId: number) => {
    return await network.sendGetNextTracks(jukeboxId)
  },
)

export const thunkClearNextTracks = createAsyncThunk(
  'jukebox/clearNextTracks',
  async (jukeboxId: number) => {
    await network.sendClearNextTracks(jukeboxId)
  },
)

export const thunkUpdateActiveLink = createAsyncThunk(
  'jukebox/updateActiveLink',
  async (payload: { jukeboxId: number; link: IJukeboxLink }) => {
    await network.sendUpdateActiveLink(payload.jukeboxId, payload.link)
    return { link: payload.link }
  },
)

export const thunkSyncSpotifyTokens = createAsyncThunk(
  'jukebox/syncSpotifyTokens',
  async (clubId: number) => {
    return await network.sendGetSpotifyToken(clubId)
  },
)
