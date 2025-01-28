import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { builderDefaults } from 'src/utils'
import {
  thunkFetchUserInfo,
  thunkFetchUserToken,
  thunkLoginUser,
} from './userThunks'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as IUser | null,
    token: null as string | null,
    loggedIn: null as boolean | null,
    status: 'idle' as StoreStatus,
    error: null as string | null,
    // spotifyToken: null as string | null,
  },
  reducers: {
    set: (state, action: { payload: { user: IUser; token: string } }) => {
      // TODO: Make thunk for verifying user login, or catching system error
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.loggedIn = true
    },
    logout: (state) => {
      state.loggedIn = false
      state.token = null
      state.user = null
    },
    update: (state, action: { payload: { user: IUser } }) => {
      const {
        first_name,
        last_name,
        email,
        image,
        id,
        username,
        created_at,
        updated_at,
      } = action.payload.user

      state.user = {
        first_name: first_name ?? state.user?.first_name,
        last_name: last_name ?? state.user?.last_name,
        email: email ?? state.user?.email,
        username: username ?? state.user?.username,
        image: image ?? state.user?.image,
        id: id ?? state.user?.id,
        clubs: [],
        created_at: created_at,
        updated_at: updated_at,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunkFetchUserInfo.fulfilled, (state, action) => {
      const { user } = action.payload
      state.user = user
    })
    builder.addCase(thunkLoginUser.rejected, (state, action) => {
      state.loggedIn = false
      state.error = action.error.message || null
    })
    builder.addMatcher(
      isAnyOf(thunkLoginUser.fulfilled, thunkFetchUserToken.fulfilled),
      (state, action) => {
        const res = action.payload
        if (res.success) {
          state.token = res.token || null
          state.loggedIn = true
        } else {
          state.loggedIn = false
          state.error = res.error || null
        }
      },
    )

    builderDefaults(builder)
  },
})

export type UserState = ReturnType<typeof userSlice.reducer>
