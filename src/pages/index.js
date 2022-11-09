import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import useDexie from "../hooks/useDexie"
import usePrevious from "../hooks/usePrevious"
import axios from "axios"

const API_KEY = process.env.GATSBY_YOUTUBE_API_KEY

const IndexPage = props => {
  const { db } = useDexie()
  const [movieList, setMovieList] = useState([])
  const [currentVideoKey, setCurrentVideoKey] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [movieListElements, setMovieListElements] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [firstFetch, setFirstFetch] = useState(null)
  const [playListId, setPlayListId] = useState(
    "PLDYcW74an50AFC1yVmYLSh3UcToxHCWwN"
  )
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
      <Eyecatch />
      <Main>
        <MainH2>RoulとはReverse Other Users Listの略で</MainH2>
        <br />
        他人の再生リストを逆再生する為だけに作られたツールです。
        <br />
        YouTubeのプレイリストを簡単に逆再生できる便利ツール。
        <br />
        <br />
        <Images>
          <img src="https://images.unsplash.com/photo-1640955014216-75201056c829?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" />
          <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" />
        </Images>
        <br />
        <br />
        <br />
        <MainH3>【他人が作成したYouTubeのプレイリストを逆再生する方法】</MainH3>
        <br />
        自分が作成したプレイリストは逆再生出来るのに、他のユーザーのプレイリストは逆再生出来ないぞ！とお困りの方。
        <br />
        その方法をご紹介します。 その方法は、
        <a href="/player">
          <strong>「Roul」</strong>
        </a>
        というツールを使います。
        <br />
        <br />
        <br />
        <MainH3>【Roulとは】</MainH3>
        <br />
        このツールは、他人のプレイリストの逆再生の為だけのツールです。
        <br />
        やり方としては、
        <br />
        <MainOl>
          <li>逆再生したいプレイリストのリンクを貼り付ける </li>
          <li>作成のボタンを押すこんな簡単に出来るって…</li>
        </MainOl>
        <br />
        <br />
        <MainH3>【Roulを使ってみよう】</MainH3>
        <br />
        今まで動画1つ1つを手動でプレイリストにしていた手間はなんだったんだ…
        以上が
        <a href="/player">
          <strong>「Roul」</strong>
        </a>
        の使い方です。
        <br />
        ただ、
        <a href="/player">
          <strong>「Roul」</strong>
        </a>
        にもデメリットはあります。 それは、
        「アプリではなく、ブラウザなので、オフライン再生が出来ない。」
        という点です。
        <br />
        パソコンで使う分にはOKですが、スマホだと不満に思う方もおられるかも知れません。
        <br />
        今後改善される事を期待しましょう。
      </Main>
    </Layout>
  )
}

export const SCReverse = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`

export const Main = styled.div`
  color: black;
  width: 980px;
  margin: 0 auto;
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  @media screen and (max-width: 980px) {
    width: calc(100% - 32px);
  }
`

export const MainH2 = styled.h2`
  border-left: 5px solid #ff0000;
  padding-left: 5px;
`

export const MainH3 = styled.h3`
  display: inline-block;
  border-bottom: 3px solid #ff0000;
  margin-bottom: 24px;
`

export const MainOl = styled.ol`
  display: inline-block;
  background-color: #ffaaaa;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-right: 16px;
  border-radius: 8px;
`

export const Images = styled.div`
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
  img {
    padding-left: 8px;
    padding-right: 8px;
    width: calc(50% - 16px);
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
  margin-right: 32px;
  margin-left: 32px;
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
    color: black;
  }
  img {
    width: 80px;
    height: 100%;
    margin-right: 10px;
  }
  @media screen and (max-width: 768px) {
    margin-top: 60px;
    width: calc(100% - 48px);
    margin-left: 24px;
  }
`

export const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
`

export const Eyecatch = styled.div`
  display: flex;
  height: 380px;
  margin-bottom: 56px;
  background: url("https://images.unsplash.com/photo-1548328928-34db1c5fcc1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  align-items: center;
  justify-content: center;
`

export const Video = styled.div`
  width: calc(100% - 298px);
  margin-left: 24px;
  @media screen and (max-width: 768px) {
    width: calc(100% - 48px);
  }
`

export default IndexPage
