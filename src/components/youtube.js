import React, { useEffect, useState } from "react"
import styled from "styled-components"
import YTPlayer from "yt-player"

const Youtube = ({ video, onEnded = () => {} }) => {
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    setPlayer(new YTPlayer("#ytplayer", { width: 480, height: 270 }))

    if (player) {
      return () => player.destroy
    }
  }, [])

  useEffect(() => {
    if (video && player) {
      player.load(video.resourceId.videoId, true)
      player.setVolume(100)
      player.on("playing", () => {
        console.log(player.getDuration())
      })
      player.on("ended", () => {
        onEnded()
        player.destroy()
      })

      return () => player.destroy
    }
  }, [video, player])

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
