import React, { useEffect, useRef } from "react"

// Scroll Animations
import { useInView } from "react-intersection-observer"
import { useAnimation } from "framer-motion"

//Styled Components
import { Container, Flex } from "../styles/globalStyles"
import { FooterNav, FooterContent } from "../styles/footerStyles"

const Footer = () => {
  const animation = useAnimation()
  const [footerRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px",
  })
  useEffect(() => {
    if (inView) {
      animation.start("visible")
    }
  }, [animation, inView])

  return (
    <FooterNav
      ref={footerRef}
      animate={animation}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] },
        },
        hidden: { opacity: 0, y: 72 },
      }}
    >
      <Container>
        <Flex spaceBetween>
          <FooterContent>
            <p>© Fools 2021</p>
          </FooterContent>
        </Flex>
      </Container>
    </FooterNav>
  )
}

export default Footer
