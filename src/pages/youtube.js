import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import axios from "axios"

const API_KEY = "11111111"

const YoutubePage = props => {
  const [movieList, setMovieList] = useState([])

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
        console.log(response.data.items)
        setMovieList(response.data.items)
      }
    }
    f()
  }, [setMovieList])

  const movieListElements = movieList.reverse().map(movie => {
    const snippet = movie.snippet
    const videoId = snippet.resourceId.videoId
    const videoPublishedAt = snippet.videoPublishedAt
    return (
      <li>
        id is {videoId}, title is "{snippet.title}"<br />
        videoPublishedAt: {new Date(videoPublishedAt).toLocaleString()}
        <br />
        <iframe
          width="280"
          height="157"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </li>
    )
  })

  return (
    <Layout>
      <ul>{movieListElements}</ul>
    </Layout>
  )
}

export default YoutubePage
