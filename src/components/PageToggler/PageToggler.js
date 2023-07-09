import { useAnimationControls } from "framer-motion";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import { ActivePageContext } from "../../App";
import { gridAreasMatrix } from "./PageTogglerConsts.js";
import {
  StyledPageToggler,
  TogglerContainer,
} from "./Styles/StyledPageToggler";

function PageToggler({ children }) {
  const { activePage, setActivePage } = useContext(ActivePageContext);
  const animationControls = useAnimationControls();
  const pageTogglerRef = useRef(null);
  const togglerContainerRef = useRef(null);
  const vPos = useRef(0);
  const rafId = useRef(null);
  const prevScrollTop = useRef(0);
  const direction = useRef(0);

  const toggleLayout = (layout) => {
    togglerContainerRef.current.style.gridTemplateAreas =
      gridAreasMatrix[layout][vPos.current];
  };

  useEffect(() => {
    if (activePage !== null) {
      animationControls.start({ x: activePage === 0 ? "0%" : "-50%" });
    }
  }, [activePage, animationControls]);

  useEffect(() => {
    const raf = () => {
      const scrollTop = pageTogglerRef.current.scrollTop;
      if (scrollTop !== prevScrollTop.current) {
        direction.current = scrollTop - prevScrollTop.current > 0 ? 1 : -1;
        prevScrollTop.current = scrollTop;

        const viewportHeight = pageTogglerRef.current.clientHeight;
        const firstPage = document.querySelector(`.p0`);
        const secondPage = document.querySelector(`.p1`);
        const pagesEls = [firstPage, secondPage];
        const activePageHeight = pagesEls?.[activePage].clientHeight || null;

        const arePagesBlending =
          scrollTop + viewportHeight >= activePageHeight &&
          scrollTop <= activePageHeight;

        if (arePagesBlending && vPos.current === 0 && direction.current === 1) {
          vPos.current = 1;
          toggleLayout(activePage);
          animationControls.set({ x: "0%" });
        }

        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          direction.current === 1
        ) {
          vPos.current = 2;
          setActivePage(activePage === 0 ? 1 : 0);
          toggleLayout(activePage);
          animationControls.set({ x: activePage === 0 ? "-50%" : "0%" });
        }

        if (
          arePagesBlending &&
          vPos.current === 2 &&
          direction.current === -1
        ) {
          vPos.current = 1;
          toggleLayout(activePage === 0 ? 1 : 0);
          animationControls.set({ x: "0%" });
        }

        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          direction.current === -1
        ) {
          vPos.current = 0;
          setActivePage(activePage === 0 ? 1 : 0);
          toggleLayout(activePage);
          animationControls.set({ x: activePage === 1 ? "0%" : "-50%" });
        }
      }
      rafId.current = requestAnimationFrame(raf);
    };

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

    rafId.current = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [setActivePage, animationControls, activePage]);

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

/*
  // const prevActivePage = useRef(activePage);
  // const prevScrollTop = useRef(0);
  // const arePagesBlending = useRef(false);

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

      arePagesBlending.current =
        scrollTop + viewportHeight >= activePageHeight - offsetPageBlending &&
        scrollTop <= activePageHeight;

      // Make sure, that we run the next condition only once.
      if (arePagesBlending.current && activePage === null) return;

      // We are started to scroll between the page 1 and 2
      // 1. Put them under each other in correct order
      // 2. Save the curent active page for later usage
      // 3. Reset x position of the TogglerContainer back to normal
      // 4. Unset activePage, since there is no active page in this area
      if (arePagesBlending.current) {
        togglerContainerRef.current.style.gridTemplateAreas =
          activePage === 1 ? "'p1 p0c' 'p0 p1c'" : "'p0 p1c' 'p1 p0c'";
        // => default
        // p0 p1
        // p0c p1c

        // => activepage: 0
        // p0 p1c
        // p1 p0c

        // => activepage: 1
        // p1 p0c
        // p0 p1c
        prevActivePage.current = activePage;
        animationControls.set({ x: "0%" });
        setActivePage(null);
        return;
      }

      togglerContainerRef.current.style.gridTemplateAreas = "'p0 p1' 'p1c p0c'";

      if (activePage === null) {
        // Reset page back to original postion without animation
        animationControls.set({
          x: prevActivePage.current === 1 ? "0%" : "-50%",
        });
        // NOTE This won't cause the animation, because we hardsetted it on the prev line
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
*/
