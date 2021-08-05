import React, { createContext, useReducer, useContext } from "react"

//Define Conext
const YoutubeApiStateContext = createContext()
const YoutubeApiDispatchContext = createContext()

//Reducer
const youtubeApiReducer = (state, action) => {
  switch (action.type) {
    case "SET_YOUTUBE_API": {
      return {
        ...state,
        youtubeApi: action.youtubeApi,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

//Provider

export const YoutubeApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(youtubeApiReducer, {
    youtubeApi: null,
  })

  return (
    <YoutubeApiDispatchContext.Provider value={dispatch}>
      <YoutubeApiStateContext.Provider value={state}>
        {children}
      </YoutubeApiStateContext.Provider>
    </YoutubeApiDispatchContext.Provider>
  )
}

//custom hooks for when we want to use our global state
export const useYoutubeApiStateContext = () =>
  useContext(YoutubeApiStateContext)

export const useYoutubeApiDispatchContext = () =>
  useContext(YoutubeApiDispatchContext)
