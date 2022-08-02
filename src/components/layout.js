import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import { createGlobalStyle, ThemeProvider } from "styled-components"
import { normalize } from "styled-normalize"

import Header from "./header"
import Footer from "./footer"

const GlobalStyle = createGlobalStyle`
${normalize}
html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
}
body {
  font-size: 16px;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #fff;
  overscroll-behavior: none;
  overflow-x: hidden;
}
h1, h2, h3, h4 {
  text-decoration: none;
  margin: 0;
  padding: 0;
}
`

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const darkTheme = {
    background: "#fff",
    text: "#222",
    red: "#ea291e",
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Header />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
