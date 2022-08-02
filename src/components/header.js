import { Link } from "gatsby"
import React from "react"
import { HeaderNav, Logo } from "../styles/headerStyles"
import { Flex } from "../styles/globalStyles"
import styled from "styled-components"

const Header = () => {
  return (
    <HeaderNav>
      <Flex spaceBetween noHeight>
        <Logo>
          <Link to="/">Roul</Link>
          <HeaderH1>Youtubeプレイリスト再生ツール</HeaderH1>
        </Logo>
        <Link to="/player">PLAYER Page</Link>
      </Flex>
    </HeaderNav>
  )
}

export const HeaderH1 = styled.div`
  font-size: 12px;
  color: #666;
  padding-left: 8px;
  padding-bottom: 4px;
  font-weight: bold;
`

export default Header
