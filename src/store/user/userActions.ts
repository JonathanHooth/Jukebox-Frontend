import { unwrapResult } from '@reduxjs/toolkit'
import { Network } from 'src/network'
import { generateLocalData, isUser } from 'src/utils'
import { store } from '../store'
import { userSlice } from './userSlice'
import {
  thunkFetchUserInfo,
  thunkFetchUserToken,
  thunkLoginUser,
} from './userThunks'

const { logout, set, update } = userSlice.actions

const network = Network.getInstance()

const {
  set: setLocalUserInfo,
  clear: clearLocalUserInfo,
  get: getLocalUserInfo,
} = generateLocalData<IUser>('user-info')

const {
  set: setLocalUserToken,
  clear: clearLocalUserToken,
  get: getLocalUserToken,
} = generateLocalData<string>('osc-token')

/**
 * Login user, return token
 */
export const loginUser = async (email: string, password: string) => {
  const res = await store
    .dispatch(thunkLoginUser({ email, password }))
    .then(unwrapResult)
    .catch((error) => {
      console.log('actions error:', error.emailError)
      throw error
    })

  if (res.success) {
    setLocalUserToken(res.token)
  } else {
    clearLocalUserToken()
  }

  return res
}

/**
 * Register user, needs work!!!
 */
export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string,
): Promise<{ success: boolean } & { [key: string]: any }> => {
  if (password === confirmPassword) {
    console.log(
      `Registration successful - ${email}, ${firstName}, ${lastName}, ${password}, ${confirmPassword}`,
    )
    return {
      success: true,
    }
  }
  console.log('Registration failed')
  return {
    success: false,
  }
}

/**
 * Fetch user's info, return user
 */
export const fetchUserInfo = async (): Promise<void | IUser> => {
  const user = await store
    .dispatch(thunkFetchUserInfo())
    .then(unwrapResult)
    .then((result) => result.user)
    .catch((error) => {
      console.log('Error fetching user details:', error)
      store.dispatch(logout())
    })

  setLocalUserInfo(user ?? null)
  return user
}

export const logoutUser = () => {
  store.dispatch(logout())
  clearLocalUserInfo()
  clearLocalUserToken()
}

export const setUser = (user: IUser, token: string) => {
  store.dispatch(set({ user, token }))
  network.setToken(token)
}

// export const initializeUser = async () => {
//   try {
//     const user = getLocalUserInfo()
//     const token = getLocalUserToken()

//     if (!user || !token) return logoutUser()

//     if (isUser(user)) {
//       setUser(user, token)
//     } else {
//       logoutUser()
//     }
//   } catch (e) {
//     logoutUser()
//   }
// }

export const updateStoreUser = async (user: IUser) => {
  store.dispatch(update({ user }))
  setLocalUserInfo(user)
}

export const initializeUser = async () => {
  const token = getLocalUserToken()
  const user = getLocalUserInfo()

  if (token && user && isUser(user)) {
    setUser(user, token)

    return
  }

  const updatedToken = await store
    .dispatch(thunkFetchUserToken())
    .then(unwrapResult)
    .then((res) => res.token)
    .catch((error) => {
      console.log('Error fetching user details:', error)
      store.dispatch(logout())
    })

  console.log('updated token:', updatedToken)

  if (updatedToken) {
    setLocalUserToken(updatedToken)
  } else {
    logoutUser()
  }
}
