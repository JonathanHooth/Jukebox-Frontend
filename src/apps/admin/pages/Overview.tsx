import './Overview.scss'

import FallbackImg from 'src/assets/img/jukeboxImage.png'
import Disk from 'src/assets/svg/Disk.svg?react'

import { createContext, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AudioPlayer, TrackList } from 'src/components'
import { PlayerContext } from 'src/context'
import { fetchNextTracks } from 'src/store'
import { selectCurrentJukebox, selectNextTracks } from 'src/store/jukebox'
import { TrackModifyContext } from './trackContext'

export const Overview = () => {
  const queuedTracks = useSelector(selectNextTracks)
  const { playerState } = useContext(PlayerContext)
  const currentJukebox = useSelector(selectCurrentJukebox)

  useEffect(() => {
    console.log('queued tracks ', queuedTracks)
    fetchNextTracks()
  }, [currentJukebox])

  return (
    <>
      <TrackModifyContext.Provider value={false}>
        <div className="grid overview__header">
          <div className="col-6 overview__header__audio-card">
            <AudioPlayer />
          </div>

          <div className="col-1"></div>

          <div className="col-5 overview__disk">
            {playerState?.is_playing ? (
              <div className="disk-container">
                <img
                  className="disk__curr-song diskSpin"
                  src={
                    playerState?.current_track?.track.preview_url ?? FallbackImg
                  }
                  alt={playerState?.current_track?.track.name}
                />
                <Disk />
              </div>
            ) : (
              <div className="disk-container">
                <img
                  className="disk__curr-song"
                  src={
                    playerState?.current_track?.track.preview_url ?? FallbackImg
                  }
                  alt={playerState?.current_track?.track.name}
                />
                <Disk />
              </div>
            )}
          </div>
        </div>

        <div className="grid overview__track__shifter">
          <div className="col-12 overview__fill-height">
            <div className="overview__song-queue">
              <h2 className="overview__song-queue__title">Next Up</h2>
              <TrackList tracks={queuedTracks} maxCount={4} />
            </div>
          </div>
        </div>
      </TrackModifyContext.Provider>
    </>
  )
}
