import React, { useEffect, useState } from "react"
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
      youtubeApi.load(video.resourceId.videoId, true)
      youtubeApi.setVolume(100)
      youtubeApi.on("playing", () => {
        console.log(youtubeApi.getDuration())
      })

      youtubeApi.on("ended", () => {
        onEnded()
        // youtubeApi.destroy()
      })

      return () => youtubeApi.destroy
    }
  }, [video, youtubeApi])

  return (
    <>
      <Title>{video.title}</Title>
      <div id="ytplayer" />
      <Description>{video.description}</Description>
    </>
  )
}

export const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`

export const Description = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  margin-top: 32px;
`

export default Youtube
