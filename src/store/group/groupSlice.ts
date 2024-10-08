import { createSlice } from '@reduxjs/toolkit'
import { thunkFetchGroupInfo, thunkFetchGroupSpotifyAuth } from './groupThunks'

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    currentGroup: null as IGroup | null,
    spotifyAuth: null as ISpotifyAuth | null,
    status: 'idle' as StoreStatus,
    error: null as string | null,
    allGroups: [] as IGroup[],
  },
  reducers: {
    setCurrentGroupReducer: (state, action: { payload: IGroup }) => {
      state.currentGroup = action.payload
    },
    setAllGroupsReducer: (state, action: { payload: IGroup[] }) => {
      state.allGroups = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunkFetchGroupSpotifyAuth.fulfilled, (state, action) => {
      state.spotifyAuth = action.payload
    })
    builder.addCase(thunkFetchGroupInfo.fulfilled, (state, action) => {
      state.currentGroup = action.payload
    })

    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.status = 'loading'
      },
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action: any) => {
        state.status = 'failed'
        state.error = action.error.message || null
      },
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state) => {
        state.status = 'succeeded'
        state.error = null
      },
    )
  },
})

export type GroupState = ReturnType<typeof groupSlice.reducer>
