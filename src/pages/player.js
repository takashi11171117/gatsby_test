import React, { useState, useEffect } from "react"
import { YoutubeApiProvider } from "../context/youtubeContext"
import Switch from "react-switch"
import styled from "styled-components"
import Layout from "../components/layout"
import Youtube from "../components/youtube"
import useDexie from "../hooks/useDexie"
import usePrevious from "../hooks/usePrevious"
import axios from "axios"

const API_KEY = process.env.GATSBY_YOUTUBE_API_KEY

const IndexPage = props => {
  const { db } = useDexie()
  const [movieList, setMovieList] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoKey, setCurrentVideoKey] = useState(0)
  const [movieListElements, setMovieListElements] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [firstFetch, setFirstFetch] = useState(null)
  const [playListId, setPlayListId] = useState("")
  const [isReverse, setIsReverse] = useState(false)
  const prevPlayListId = usePrevious(playListId)
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
    const setNewVideo = async (playListHistory, firstFetch, videos) => {
      if (firstFetch) {
        return
      }

      if (firstFetch !== null && prevPlayListId === playListId) {
        return
      }

      if (playListHistory) {
        let firstVideoKey = 0
        const movie = videos.filter((movie, index) => {
          if (movie.snippet.resourceId.videoId === playListHistory.lastVideo) {
            firstVideoKey = index
          }
          return movie.snippet.resourceId.videoId === playListHistory.lastVideo
        })[0]
        console.log("aaaa")
        if (movie !== null && movie !== undefined) {
          setCurrentVideo(movie.snippet)
          setCurrentVideoKey(firstVideoKey)
        } else {
          console.log(videos)
          setCurrentVideo(videos[0].snippet)
          setCurrentVideoKey(0)
        }
      } else {
        const videoId = videos[0].snippet.resourceId.videoId
        if (db !== undefined && db !== null) {
          await db.playLists.put({
            playListId,
            lastVideo: videoId,
          })
          await db.videos.put({
            videoId: videoId,
            lastTime: 0,
            playListId,
          })
        }
        setCurrentVideo(videos[0].snippet)
        setCurrentVideoKey(0)
      }
    }

    const f = async () => {
      if (window !== undefined) {
        await fetchYoutubeListAll({ pageToken: "" })
        setMovieList(videos)

        if (videos.length !== 0) {
          let playListHistory
          if (db !== undefined && db !== null) {
            playListHistory = await db.playLists.get(playListId.toString())
          }
          if (firstFetch === null) {
            setFirstFetch(true)
          }

          await setNewVideo(playListHistory, firstFetch, videos)

          setFirstFetch(false)
        }
      }
    }
    f()
  }, [playListId])

  useEffect(() => {
    const f = async () => {
      if (movieList.length !== 0) {
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
    if (!youtubeUrl.match(/https?/)) {
      return
    }
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
            {currentVideo ? (
              <Youtube
                video={currentVideo}
                onEnded={() => {
                  setCurrentVideoKey(i => i + 1)
                }}
              />
            ) : (
              <div>
                URLが入力されていません。
                <br /> プレイリストのURLを入力して下さい。
                <br />
                <br />
                <img src="https://images.unsplash.com/photo-1616024088891-b7665fb9699e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" />
              </div>
            )}
          </Video>
          <SCVideoListContainer>
            <VideoList>
              <SCReverse>
                <span>reverse:　</span>
                <Switch onChange={handleChange} checked={isReverse} />
              </SCReverse>
              {movieListElements !== null && movieListElements.length > 0 ? (
                <ul>{movieListElements}</ul>
              ) : (
                <div>
                  <br />
                  URLが入力されていません。
                  <br /> プレイリストのURLを入力して下さい。
                </div>
              )}
            </VideoList>
          </SCVideoListContainer>
        </Main>
      </YoutubeApiProvider>
    </Layout>
  )
}

export const SCReverse = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`

export const Main = styled.div`
  display: flex;
  margin-top: 16px;
  color: #333;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
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
  overflow: scroll;
  height: 100vh;
  width: 100%;
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
    color: #333;
  }
  img {
    width: 80px;
    height: 100%;
    margin-right: 10px;
  }
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    --bg-opacity: 1;
    background-color: #666666;
  }
`

export const SCVideoListContainer = styled.div`
  padding: 8px;
  margin-right: 24px;
  margin-left: 24px;
  width: 250px;
  border: 1px solid #333333;
  @media screen and (max-width: 768px) {
    margin-top: 60px;
    width: calc(100% - 64px);
  }
`

export const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
`

export const Video = styled.div`
  width: calc(100% - 298px);
  margin-left: 32px;
  @media screen and (max-width: 768px) {
    width: calc(100% - 48px);
    margin-left: 24px;
  }
  img {
    width: 100%;
    aspect-ratio: 16 / 16;
    object-fit: cover;
    object-position: right top;
  }
`

export default IndexPage
