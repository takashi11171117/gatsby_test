import { useState, useEffect } from "react"
import Dexie from "dexie"
import relationships from "dexie-relationships"

export default function useDexie() {
  const [db, setDb] = useState()

  useEffect(() => {
    var db = new Dexie("YoutubeListDB", { addons: [relationships] })
    db.version(1).stores({
      playLists: "playListId, lastVideoId",
      videos: "++id, videoId, lastTime, playlistId -> playlists.id",
    })
    setDb(db)
  }, [])

  return {
    db,
  }
}
