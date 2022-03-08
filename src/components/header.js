import { Link } from "gatsby"
import React, { useEffect, useRef } from "react"
import { HeaderNav, Logo, Menu } from "../styles/headerStyles"
import { Container, Flex } from "../styles/globalStyles"

import {
  useGlobalDispatchContext,
  useGlobalStateContext,
} from "../context/globalContext"

const Header = ({
  onCursor,
  setHamburgerPosition,
  setToggleMenu,
  toggleMenu,
}) => {
  const dispatch = useGlobalDispatchContext()
  const { currentTheme } = useGlobalStateContext()
  const hamburger = useRef(null)

  const toggleTheme = () => {
    if (currentTheme === "dark") {
      dispatch({ type: "TOGGLE_THEME", theme: "light" })
    } else {
      dispatch({ type: "TOGGLE_THEME", theme: "dark" })
    }
  }

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme)
  }, [currentTheme])

  return (
    <HeaderNav
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: -72, opacity: 0 }}
      transition={{
        duration: 1,
        ease: [0.6, 0.05, -0.01, 0.9],
      }}
    >
      <Flex spaceBetween noHeight>
        <Logo>
          <Link to="/">YOUTUBE PLAYLIST PLAYER</Link>
        </Logo>
        {/* <Menu
            onClick={() => setToggleMenu(!toggleMenu)}
            ref={hamburger}
            onMouseEnter={menuHover}
            onMouseLeave={onCursor}
          >
            <button>
              <span></span>
              <span></span>
            </button>
          </Menu> */}
      </Flex>
    </HeaderNav>
  )
}

export default Header
