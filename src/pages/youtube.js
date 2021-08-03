import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import Youtube from "../components/youtube"
import axios from "axios"

const API_KEY = "AIzaSyB2FxBG2xcir5A7TuDnWoeDiyAG0nzcKPs"

const YoutubePage = props => {
  const [movieList, setMovieList] = useState([])
  const [currentVideo, setCurrentVideo] = useState()
  const [currentVideoKey, setCurrentVideoKey] = useState(0)

  useEffect(() => {
    const f = async () => {
      if (window !== undefined) {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems`
        const response = await axios.get(url, {
          params: {
            playlistId: "PLDYcW74an50AFC1yVmYLSh3UcToxHCWwN",
            part: "snippet",
            maxResults: 10,
            key: API_KEY,
          },
        })
        response.data.items.reverse()
        setMovieList(response.data.items)
        setCurrentVideo(response.data.items[0].snippet)
        setCurrentVideoKey(0)
      }
    }
    f()
  }, [])

  useEffect(() => {
    if (movieList.length !== 0) {
      setCurrentVideo(movieList[currentVideoKey].snippet)
    }
  }, [currentVideoKey])

  const movieListElements = movieList.map(movie => {
    const snippet = movie.snippet
    return (
      <li>
        <Title>{snippet.title}</Title>
        <img src={snippet.thumbnails.medium.url} alt="" />
      </li>
    )
  })

  return (
    <Layout>
      <Main>
        <VideoList>
          <ul>{movieListElements}</ul>
        </VideoList>
        <Video>
          {currentVideo && (
            <Youtube
              video={currentVideo}
              onEnded={() => {
                setCurrentVideoKey(i => i + 1)
              }}
            />
          )}
        </Video>
        <p>{currentVideoKey}</p>
      </Main>
    </Layout>
  )
}

export const Main = styled.div`
  display: flex;
  margin-top: 120px;
`

export const VideoList = styled.div`
  width: 250px;
  li {
    list-style: none;
    margin-bottom: 16px;
  }
  img {
    width: 100%;
    height: auto;
  }
`

export const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
`

export const Video = styled.div`
  width: calc(100% - 298px);
  margin-left: 24px;
  margin-right: 24px;
`

export default YoutubePage
