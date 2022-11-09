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
      youtubeApi.load(video.resourceId.videoId, true)
      youtubeApi.setVolume(100)
      youtubeApi.on("playing", () => {
        // console.log(youtubeApi.getDuration())
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
      <div>
        <SCReadMoreCheck id="check1" type="checkbox" />
        <SCDescription id="description">
          {video.description.split("\n").map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item}
                <br />
              </React.Fragment>
            )
          })}
        </SCDescription>
        <SCReadMoreLabel id="label" for="check1" />
      </div>
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
  height: 100px;
  position: relative;
  overflow: hidden;
  &::before {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    content: "";
    height: 50px;
    background: -webkit-linear-gradient(
      top,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0.8) 50%,
      #fff 100%
    );
    background: linear-gradient(
      top,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0.8) 50%,
      #fff 100%
    );
  }
`

export const SCReadMoreLabel = styled.label`
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  margin: 0 auto;
  z-index: 2;
  padding: 0 10px;
  background-color: #0f0f0f;
  border-radius: 10px;
  color: #fff;
  &::before {
    content: "続きを読む";
    font-size: 12px;
  }
`

const SCReadMoreCheck = styled.input`
  display: none;
  &:checked ~ #label {
    position: static;
    transform: translateX(0);
    -webkit-transform: translateX(0);
    &:before {
      content: "閉じる";
    }
  }
  &:checked ~ #description {
    height: auto;
    &::before {
      display: none;
    }
  }
`

export default Youtube
