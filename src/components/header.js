import { Link } from "gatsby"
import React from "react"
import { HeaderNav, Logo } from "../styles/headerStyles"
import { Flex } from "../styles/globalStyles"

const Header = () => {
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
        <Link to="/player">PLAYER Page</Link>
      </Flex>
    </HeaderNav>
  )
}

export default Header
