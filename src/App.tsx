import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { SocketProvider, Theme } from './context'
import { SpotifyPlayerProvider } from './context/PlayerContext'
import {
  fetchCurrentGroupInfo,
  fetchUserInfo,
  initializeUser,
  logoutUser,
  selectGroupSpotifyAuth,
  selectUser,
  selectUserLoggedIn,
  setAllGroups,
  setCurrentGroup,
} from './store'

export const App = () => {
  const userIsLoggedIn = useSelector(selectUserLoggedIn)
  const userInfo = useSelector(selectUser)
  const spotifyAuth = useSelector(selectGroupSpotifyAuth)

  const navigate = useNavigate()

  useEffect(() => {
    if (userIsLoggedIn === false) {
      navigate('/auth/admin/login')
    }
  }, [userIsLoggedIn])

  useEffect(() => {
    initializeUser()
  }, [])

  useEffect(() => {
    if (userIsLoggedIn) {
      // Store new user info
      fetchUserInfo().then(async (resUserInfo) => {
        if (!resUserInfo) return

        setCurrentGroup(resUserInfo.groups[0])
        setAllGroups(resUserInfo.groups)
        await fetchCurrentGroupInfo()
      })
    } else if (userInfo || userIsLoggedIn === false) {
      logoutUser()
    }
  }, [userIsLoggedIn])

  return (
    <Theme>
      <SpotifyPlayerProvider token={spotifyAuth?.accessToken}>
        <SocketProvider />
        <Outlet />
      </SpotifyPlayerProvider>
    </Theme>
  )
}
