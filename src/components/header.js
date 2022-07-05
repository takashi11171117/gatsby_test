import { Link } from "gatsby"
import React from "react"
import { HeaderNav, Logo } from "../styles/headerStyles"
import { Flex } from "../styles/globalStyles"

const Header = () => {
  return (
    <HeaderNav>
      <Flex spaceBetween noHeight>
        <Logo>
          <Link to="/">Roul</Link>
        </Logo>
        <Link to="/player">PLAYER Page</Link>
      </Flex>
    </HeaderNav>
  )
}

export default Header
