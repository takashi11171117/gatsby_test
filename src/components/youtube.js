import React, { useEffect } from "react"
import styled from "styled-components"
import YTPlayer from "yt-player"

import {
  useYoutubeApiDispatchContext,
  useYoutubeApiStateContext,
} from "../context/youtubeContext"

const Youtube = ({ video, onEnded = () => {} }) => {
  const youtubeApiDispatch = useYoutubeApiDispatchContext()
  const { youtubeApi } = useYoutubeApiStateContext()

  useEffect(() => {
    youtubeApiDispatch({
      type: "SET_YOUTUBE_API",
      youtubeApi: new YTPlayer("#ytplayer", { width: 480, height: 270 }),
    })

    if (youtubeApi) {
      return () => youtubeApi.destroy
    }
  }, [])

  useEffect(() => {
    if (video && youtubeApi) {
      console.log(video)
      youtubeApi.load(video.resourceId.videoId, true)
      youtubeApi.setVolume(100)
      youtubeApi.on("playing", () => {
        console.log(youtubeApi.getDuration())
      })

      youtubeApi.on("ended", () => {
        onEnded()
        youtubeApi.destroy()
        youtubeApiDispatch({
          type: "SET_YOUTUBE_API",
          youtubeApi: new YTPlayer("#ytplayer", { width: 480, height: 270 }),
        })
      })

      return () => youtubeApi.destroy
    }
  }, [video, youtubeApi])

  return (
    <>
      <SCTitle>{video.title}</SCTitle>
      <SCPlayer>
        <div id="ytplayer" />
      </SCPlayer>
      <SCDescription>
        {video.description.split("\n").map((item, index) => {
          return (
            <React.Fragment key={index}>
              {item}
              <br />
            </React.Fragment>
          )
        })}
      </SCDescription>
    </>
  )
}

export const SCTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`

export const SCPlayer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
  margin-bottom: 50px;
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`

export const SCDescription = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  margin-top: 32px;
`

export default Youtube
