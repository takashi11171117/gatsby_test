import React, { useState, useEffect } from "react"
import { YoutubeApiProvider } from "../context/youtubeContext"
import Switch from "react-switch"
import styled from "styled-components"
import Layout from "../components/layout"
import Youtube from "../components/youtube"
import useDexie from "../hooks/useDexie"
import axios from "axios"

const API_KEY = "AIzaSyB2FxBG2xcir5A7TuDnWoeDiyAG0nzcKPs"

const YoutubePage = props => {
  const { db } = useDexie()
  const [movieList, setMovieList] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoKey, setCurrentVideoKey] = useState(0)
  const [movieListElements, setMovieListElements] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [startTime, setStartTime] = useState(0)
  const [playListId, setPlayListId] = useState(
    "PLDYcW74an50AFC1yVmYLSh3UcToxHCWwN"
  )
  const [isReverse, setIsReverse] = useState(false)
  let videos = []

  const fetchYoutubeList = async pageToken => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems`
    const response = await axios.get(url, {
      params: {
        playlistId: playListId,
        part: "snippet",
        maxResults: 50,
        key: API_KEY,
        pageToken,
      },
    })

    return response
  }

  const fetchYoutubeListAll = async ({ pageToken }) => {
    const response = await fetchYoutubeList(pageToken)
    videos = [...videos, ...response.data.items]

    if (response.data.nextPageToken) {
      await fetchYoutubeListAll({ pageToken: response.data.nextPageToken })
    }
  }

  useEffect(() => {
    const f = async () => {
      if (window !== undefined) {
        await fetchYoutubeListAll({ pageToken: "" })
        setMovieList(videos)
      }
    }
    f()
  }, [playListId])

  useEffect(() => {
    const f = async () => {
      if (movieList.length !== 0) {
        const playListHistory = await db.playLists.get(playListId.toString())

        if (playListHistory) {
          let firstVideoKey = 0
          const movie = movieList.filter((movie, index) => {
            if (
              movie.snippet.resourceId.videoId === playListHistory.lastVideo
            ) {
              firstVideoKey = index
            }
            return (
              movie.snippet.resourceId.videoId === playListHistory.lastVideo
            )
          })[0]
          setCurrentVideo(movie.snippet)
          setCurrentVideoKey(firstVideoKey)
        } else {
          const videoId = movieList[0].snippet.resourceId.videoId
          await db.playLists.put({
            playListId,
            lastVideo: videoId,
          })
          await db.videos.put({
            videoId: videoId,
            lastTime: 0,
            playListId,
          })
          setCurrentVideo(movieList[0].snippet)
          setCurrentVideoKey(0)
        }

        setMovieListElements(
          movieList.map((movie, key) => {
            if (movie) {
              const snippet = movie.snippet
              return (
                <li key={movie.id}>
                  <a
                    href="#"
                    onClick={event => {
                      event.preventDefault()
                      handleClick(snippet, key)
                    }}
                  >
                    {!Object.keys(snippet.thumbnails).length ? (
                      <div></div>
                    ) : (
                      <img src={snippet.thumbnails.medium.url} alt="" />
                    )}
                    <Title>{snippet.title}</Title>
                  </a>
                </li>
              )
            }
            return <p>動画の取得に失敗しました。</p>
          })
        )
      }
    }
    f()
  }, [movieList])

  useEffect(() => {
    const f = async () => {
      if (movieList.length !== 0) {
        console.log(movieList[currentVideoKey].snippet)
        setCurrentVideo(movieList[currentVideoKey].snippet)
        const movie = movieList[currentVideoKey]
        await db.playLists.put({
          lastVideo: movie.snippet.resourceId.videoId,
          playListId,
        })
        const videoHistory = await db.videos
          .where("videoId")
          .equals(movie.snippet.resourceId.videoId.toString())
          .first()
        if (videoHistory) {
          console.log(videoHistory)
          // await db.videos.put({
          //   id: videoHistory.id,
          //   videoId: movie.snippet.resourceId.videoId,
          //   lastTime: 0,
          //   playListId,
          // })
        } else {
          await db.videos.put({
            videoId: movie.snippet.resourceId.videoId,
            lastTime: 0,
            playListId,
          })
        }
      }
    }
    f()
  }, [currentVideoKey])

  const handleChange = () => {
    setMovieList([...movieList.reverse()])
    setIsReverse(!isReverse)
    setCurrentVideo(movieList[0].snippet)
    setCurrentVideoKey(0)
  }

  const handleClick = (snippet, key) => {
    setCurrentVideo(snippet)
    setCurrentVideoKey(key)
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(youtubeUrl)

    const url = new URL(youtubeUrl)
    const params = new URLSearchParams(url.search)

    for (let param of params) {
      if (param[0] === "list") {
        setPlayListId(param[1])
        break
      }
    }
  }

  return (
    <Layout>
      <YoutubeApiProvider>
        <Main>
          <Video>
            <InputArea onSubmit={e => handleSubmit(e)}>
              <div>
                <p>URL: (Playlist Or Channel)</p>
                <button>Search</button>
              </div>
              <input
                type="text"
                onChange={e => setYoutubeUrl(e.target.value)}
              />
            </InputArea>
            {currentVideo && (
              <Youtube
                video={currentVideo}
                onEnded={() => {
                  setCurrentVideoKey(i => i + 1)
                }}
              />
            )}
          </Video>
          <VideoList>
            <Switch onChange={handleChange} checked={isReverse} />
            <ul>{movieListElements}</ul>
          </VideoList>
        </Main>
      </YoutubeApiProvider>
    </Layout>
  )
}

export const Main = styled.div`
  display: flex;
  margin-top: 120px;
  color: white;
`

export const InputArea = styled.form`
  margin-bottom: 24px;
  input {
    width: 100%;
  }
  div {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    p {
      margin: 0;
    }
    button {
      margin-left: auto;
    }
  }
`

export const VideoList = styled.div`
  margin-right: 24px;
  margin-left: 24px;
  width: 250px;
  height: 100vh;
  overflow: scroll;
  ul {
    padding: 0;
  }
  li {
    list-style: none;
    margin-bottom: 16px;
  }
  a {
    display: flex;
    align-items: center;
    color: white;
  }
  img {
    width: 80px;
    height: 100%;
    margin-right: 10px;
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
`

export default YoutubePage
