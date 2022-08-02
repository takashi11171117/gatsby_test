import styled from "styled-components"

export const HeaderNav = styled.div`
  padding: 32px;
  a {
    color: red;
  }
`
export const Logo = styled.div`
  display: flex;
  align-items: end;
  a {
    font-size: 1.8rem;
    text-decoration: none;
    font-weight: 800;
    color: #000;
    border: 2px solid #aaa;
    padding-right: 8px;
    padding-left: 8px;
    padding-bottom: 2px;
  }
  span {
    height: 16px;
    width: 16px;
    margin: 0 4px;
    border-radius: 100%;
    display: inline-block;
    position: relative;
    bottom: 2px;
  }
`

export const Menu = styled.div`
  button {
    transform-origin: center;
    border: none;
    padding: 20px;
    background: none;
    outline: none;
    span {
      width: 36px;
      height: 8px;
      display: block;
      margin: 8px;
    }
  }
`
