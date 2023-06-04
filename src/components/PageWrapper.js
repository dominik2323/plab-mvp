import { motion, useAnimationControls } from "framer-motion";
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ActivePageContext } from "../App";

const StyledPageToggler = styled.div`
  overflow-x: hidden;
  // we have to scroll on the y axis inside this element in order to enable sticky el for the page toggler
  height: 100vh;
`;

const TogglerContainer = styled(motion.div)`
  display: flex;
  width: fit-content;
`;

function PageToggler({ children }) {
  const { activePage, setActivePage } = useContext(ActivePageContext);
  const animationControls = useAnimationControls();

  const pageTogglerRef = useRef(null);
  const togglerContainerRef = useRef(null);
  const prevActivePage = useRef(activePage);
  const prevScrollTop = useRef(0);

  useEffect(() => {
    if (activePage !== null) {
      animationControls.start({ x: activePage === 0 ? "0%" : "-50%" });
    }
  }, [activePage, animationControls]);

  useEffect(() => {
    const handleScroll = (e) => {
      const offsetPageBlending = 100;
      const viewportHeight = e.target.clientHeight;
      const pagesEls = togglerContainerRef.current.childNodes;
      const scrollTop = e.target.scrollTop;

      // WIP
      const direction = scrollTop - prevScrollTop.current > 0 ? 1 : -1;
      prevScrollTop.current = scrollTop;

      // Be sure, that we are using the highest page, even if they should be equal
      const maxPageHeight =
        Math.max(pagesEls[0].clientHeight, pagesEls[1].clientHeight) -
        viewportHeight;

      // Define the area where we scroll from page 1 to page 2
      const arePagesBlending =
        scrollTop >= maxPageHeight - offsetPageBlending &&
        scrollTop <= maxPageHeight + viewportHeight;

      // Make sure, that we run the next condition only once.
      if (arePagesBlending && activePage === null) return;

      // We are started to scroll between the page 1 and 2
      // 1. Put them under each other in correct order
      // 2. Save the curent active page for later usage
      // 3. Reset x position of the TogglerContainer back to normal
      // 4. Unset activePage, since there is no active page in this area
      if (arePagesBlending) {
        togglerContainerRef.current.style.flexDirection =
          activePage === 1 ? "column-reverse" : "column";
        prevActivePage.current = activePage;
        animationControls.set({ x: "0%" });
        setActivePage(null);
        return;
      }

      togglerContainerRef.current.style.flexDirection = "row";

      if (activePage === null) {
        // WIP
        const nextActivePage = direction === 1 ? 1 : 0;
        console.log({ nextActivePage });

        // Reset page back to original postion without animation
        animationControls.set({
          x: prevActivePage.current === 1 ? "0%" : "-50%",
        });
        // Set new active page. This won't cause the animation, because we hardsetted it on the prev line
        setActivePage(prevActivePage.current === 0 ? 1 : 0);
        e.target.scrollTop = 0;
      }
    };

    const pageWrapperRefCopy = pageTogglerRef.current;
    pageWrapperRefCopy.addEventListener("scroll", handleScroll);

    return () => {
      pageWrapperRefCopy.removeEventListener("scroll", handleScroll);
    };
  }, [activePage, animationControls, setActivePage]);

  return (
    <StyledPageToggler ref={pageTogglerRef}>
      <TogglerContainer
        ref={togglerContainerRef}
        animate={animationControls}
        transition={{ ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </TogglerContainer>
    </StyledPageToggler>
  );
}

export default PageToggler;
