import { useAnimationControls } from "framer-motion";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import { ActivePageContext } from "../../App";
import { gridAreasMatrix } from "./PageTogglerConsts.js";
import {
  StyledPageToggler,
  TogglerContainer,
} from "./Styles/StyledPageToggler";

function PageToggler({ children }) {
  const { activePage, setActivePage, setShouldUsePageToggler } =
    useContext(ActivePageContext);
  const animationControls = useAnimationControls();

  const pageTogglerRef = useRef(null);
  const togglerContainerRef = useRef(null);
  const vPos = useRef(0);
  const prevVPos = useRef(vPos.current);
  const prevScrollTop = useRef(0);
  const scrollDirection = useRef(0);
  const rafId = useRef(null);

  const toggleLayout = (layout) => {
    togglerContainerRef.current.style.gridTemplateAreas = layout;
  };

  useEffect(() => {
    animationControls.start({ x: activePage === 0 ? "0%" : "-50%" });
  }, [activePage, animationControls]);

  useEffect(() => {
    const raf = () => {
      const scrollTop = pageTogglerRef.current.scrollTop;

      if (scrollTop !== prevScrollTop.current) {
        scrollDirection.current =
          scrollTop - prevScrollTop.current > 0 ? 1 : -1;
        prevScrollTop.current = scrollTop;

        const viewportHeight = pageTogglerRef.current.clientHeight;
        const firstPage = document.querySelector(`.p0`);
        const secondPage = document.querySelector(`.p1`);
        const pagesEls = [firstPage, secondPage];
        const activePageHeight = pagesEls?.[activePage].clientHeight || null;

        const arePagesBlending =
          scrollTop + viewportHeight >= activePageHeight &&
          scrollTop <= activePageHeight;
        setShouldUsePageToggler(!arePagesBlending);

        // handle returning from pages blending back to top
        if (
          !arePagesBlending &&
          prevVPos.current === 0 &&
          vPos.current === 1 &&
          scrollDirection.current === -1
        ) {
          vPos.current = 0;
          toggleLayout(gridAreasMatrix[activePage][vPos.current]);
          animationControls.set({ x: activePage === 0 ? "0%" : "-50%" });
        }

        // handle returning from pages blending back to bottom
        if (
          !arePagesBlending &&
          prevVPos.current === 2 &&
          vPos.current === 1 &&
          scrollDirection.current === 1
        ) {
          vPos.current = 2;
          toggleLayout(gridAreasMatrix[activePage][vPos.current]);
          animationControls.set({ x: activePage === 1 ? "-50%" : "0%" });
        }

        // pages are blending from top to bottom
        if (
          arePagesBlending &&
          vPos.current === 0 &&
          scrollDirection.current === 1
        ) {
          prevVPos.current = vPos.current;
          vPos.current = 1;
          toggleLayout(gridAreasMatrix[activePage][vPos.current]);
          animationControls.set({ x: "0%" });
        }

        // set the bottom layout
        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          scrollDirection.current === 1
        ) {
          vPos.current = 2;
          setActivePage(activePage === 0 ? 1 : 0);
          toggleLayout(gridAreasMatrix[activePage][vPos.current]);
          animationControls.set({ x: activePage === 0 ? "-50%" : "0%" });
        }

        // pages are blending from bottom to top
        if (
          arePagesBlending &&
          vPos.current === 2 &&
          scrollDirection.current === -1
        ) {
          prevVPos.current = vPos.current;
          vPos.current = 1;
          toggleLayout(gridAreasMatrix[activePage === 0 ? 1 : 0][vPos.current]);
          animationControls.set({ x: "0%" });
        }

        // set the top layout
        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          scrollDirection.current === -1
        ) {
          vPos.current = 0;
          setActivePage(activePage === 0 ? 1 : 0);
          toggleLayout(gridAreasMatrix[activePage][vPos.current]);
          animationControls.set({ x: activePage === 1 ? "0%" : "-50%" });
        }
      }
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [setActivePage, setShouldUsePageToggler, animationControls, activePage]);

  useEffect(() => {
    const handleResize = () => {
      const firstPage = document.querySelector(`.p0`);
      const secondPage = document.querySelector(`.p1`);
      const firstPageCopy = document.querySelector(`.p0c`);
      const secondPageCopy = document.querySelector(`.p1c`);
      const maxHeight = Math.max(
        firstPage.clientHeight,
        secondPage.clientHeight
      );

      firstPageCopy.style.height = `${maxHeight}px`;
      secondPageCopy.style.height = `${maxHeight}px`;
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
