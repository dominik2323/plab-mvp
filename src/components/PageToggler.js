import { motion, useAnimationControls } from "framer-motion";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ActivePageContext } from "../App";

const StyledPageToggler = styled.div`
  overflow-x: hidden;
  // we have to scroll on the y axis inside this element in order to enable sticky el for the page toggler
  height: 100vh;
`;

const TogglerContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 100vw);
  grid-template-areas: "p0 p1" "p1c p0c";
  grid-gap: 0;
  align-items: start;
  width: fit-content;
  .p0 {
    grid-area: p0;
  }
  .p0c {
    grid-area: p0c;
  }
  .p1 {
    grid-area: p1;
  }
  .p1c {
    grid-area: p1c;
  }
`;

function PageToggler({ children }) {
  const { activePage, setActivePage } = useContext(ActivePageContext);
  const animationControls = useAnimationControls();

  const pageTogglerRef = useRef(null);
  const togglerContainerRef = useRef(null);
  const prevActivePage = useRef(activePage);
  const prevScrollTop = useRef(0);
  const arePagesBlending = useRef(false);

  useEffect(() => {
    if (activePage !== null) {
      animationControls.start({ x: activePage === 0 ? "0%" : "-50%" });
    }
  }, [activePage, animationControls]);

  useEffect(() => {
    const handleScroll = (e) => {
      const offsetPageBlending = 100;
      const viewportHeight = e.target.clientHeight;
      const firstPage = document.querySelector(`.p0`);
      const secondPage = document.querySelector(`.p1`);
      const pagesEls = [firstPage, secondPage];
      const scrollTop = e.target.scrollTop;

      const currentPage = activePage || prevActivePage.current;
      const activePageHeight = pagesEls?.[currentPage].clientHeight || null;

      // WIP
      // const direction = scrollTop - prevScrollTop.current > 0 ? 1 : -1;
      // prevScrollTop.current = scrollTop;

      // Define the area where we scroll from page 1 to page 2
      arePagesBlending.current =
        scrollTop >= activePageHeight - offsetPageBlending &&
        scrollTop <= activePageHeight + viewportHeight;

      // Make sure, that we run the next condition only once.
      if (arePagesBlending.current && activePage === null) return;

      // Be sure, that we are using the highest page, even if they should be equal

      // We are started to scroll between the page 1 and 2
      // 1. Put them under each other in correct order
      // 2. Save the curent active page for later usage
      // 3. Reset x position of the TogglerContainer back to normal
      // 4. Unset activePage, since there is no active page in this area
      if (arePagesBlending.current) {
        togglerContainerRef.current.style.gridTemplateAreas =
          activePage === 1 ? "'p1 p0c' 'p0 p1c'" : "'p0 p1c' 'p1 p0c'";
        // p0 p1
        // p0c p1c

        // => 0
        // p0 p1c
        // p1 p0c

        // => 1
        // p1 p0c
        // p0 p1c
        prevActivePage.current = activePage;
        animationControls.set({ x: "0%" });
        setActivePage(null);
        return;
      }

      togglerContainerRef.current.style.gridTemplateAreas = "'p0 p1' 'p1c p0c'";

      if (activePage === null) {
        // WIP
        // const nextActivePage = direction === 1 ? 1 : 0;
        // console.log({ nextActivePage });

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

  useEffect(() => {
    const handleResize = () => {
      const firstPage = document.querySelector(`.p0`);
      const secondPage = document.querySelector(`.p1`);
      const firstPageCopy = document.querySelector(`.p0c`);
      const secondPageCopy = document.querySelector(`.p1c`);

      firstPageCopy.style.height = `${firstPage.clientHeight}px`;
      secondPageCopy.style.height = `${secondPage.clientHeight}px`;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyledPageToggler ref={pageTogglerRef}>
      <TogglerContainer
        ref={togglerContainerRef}
        animate={animationControls}
        transition={{ ease: [0.22, 1, 0.36, 1] }}>
        {children.map((c, i) => (
          <Fragment key={i}>
            <div className={`p${i}`}>{c}</div>
            <div className={`p${i}c`}>
              <span>COPY: {i}</span>
            </div>
          </Fragment>
        ))}
      </TogglerContainer>
    </StyledPageToggler>
  );
}

export default PageToggler;
