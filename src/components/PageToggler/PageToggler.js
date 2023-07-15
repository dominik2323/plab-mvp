import { useAnimate } from "framer-motion";
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
  const [scope, animate] = useAnimate();

  const pageTogglerRef = useRef(null);
  const vPos = useRef(0);
  const prevVPos = useRef(vPos.current);
  const prevScrollTop = useRef(0);
  const scrollDirection = useRef(0);
  const rafId = useRef(null);
  const isSettingLayout = useRef(false);

  useEffect(() => {
    // disable animation when changing layouts
    if (!isSettingLayout.current) {
      animate(
        scope.current,
        { x: activePage === 0 ? "0%" : "-50%" },
        { ease: [0.22, 1, 0.36, 1] }
      );
    }
  }, [animate, scope, activePage]);

  useEffect(() => {
    const setLayout = (layout, motionValue) => {
      isSettingLayout.current = true;
      animate(scope.current, motionValue, { duration: 0 }).then(() => {
        scope.current.style.gridTemplateAreas = layout;
        isSettingLayout.current = false;
      });
    };

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

        // top page >>> (pages blending) >>> [ top page ] - bottom page
        if (
          !arePagesBlending &&
          prevVPos.current === 0 &&
          vPos.current === 1 &&
          scrollDirection.current === -1
        ) {
          vPos.current = 0;
          setLayout(gridAreasMatrix[activePage][vPos.current], {
            x: activePage === 0 ? "0%" : "-50%",
          });
        }

        // top page - [ bottom page ] <<< (pages blending) <<< bottom page
        if (
          !arePagesBlending &&
          prevVPos.current === 2 &&
          vPos.current === 1 &&
          scrollDirection.current === 1
        ) {
          vPos.current = 2;
          setLayout(gridAreasMatrix[activePage][vPos.current], {
            x: activePage === 1 ? "-50%" : "0%",
          });
        }

        // (top page) >>> [ pages blending ] - bottom page
        if (
          arePagesBlending &&
          vPos.current === 0 &&
          scrollDirection.current === 1
        ) {
          prevVPos.current = vPos.current;
          vPos.current = 1;
          setLayout(gridAreasMatrix[activePage][vPos.current], {
            x: "0%",
          });
        }

        // top page - (pages blending) >>> [ bottom page ]
        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          scrollDirection.current === 1
        ) {
          vPos.current = 2;
          setActivePage(activePage === 0 ? 1 : 0);
          setLayout(gridAreasMatrix[activePage][vPos.current], {
            x: activePage === 0 ? "-50%" : "0%",
          });
        }

        // top page - (pages blending) <<< [ bottom page ]
        if (
          arePagesBlending &&
          vPos.current === 2 &&
          scrollDirection.current === -1
        ) {
          prevVPos.current = vPos.current;
          vPos.current = 1;
          setLayout(gridAreasMatrix[activePage === 0 ? 1 : 0][vPos.current], {
            x: "0%",
          });
        }

        // [ top page ] <<< (pages blending) - bottom page
        if (
          !arePagesBlending &&
          vPos.current === 1 &&
          scrollDirection.current === -1
        ) {
          vPos.current = 0;
          setActivePage(activePage === 0 ? 1 : 0);
          setLayout(gridAreasMatrix[activePage][vPos.current], {
            x: activePage === 1 ? "0%" : "-50%",
          });
        }
      }
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [setActivePage, setShouldUsePageToggler, animate, activePage, scope]);

  useEffect(() => {
    const handleResize = () => {
      const topPage = document.querySelector(`.p0`);
      const bottomPage = document.querySelector(`.p1`);
      const topPageCopy = document.querySelector(`.p0c`);
      const bottomPageCopy = document.querySelector(`.p1c`);
      const maxHeight = Math.max(topPage.clientHeight, bottomPage.clientHeight);

      topPageCopy.style.height = `${maxHeight}px`;
      bottomPageCopy.style.height = `${maxHeight}px`;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyledPageToggler ref={pageTogglerRef}>
      <TogglerContainer ref={scope}>
        {children.map((c, i) => (
          <Fragment key={i}>
            <div className={`p${i}`}>{c}</div>
            <div className={`p${i}c`} />
          </Fragment>
        ))}
      </TogglerContainer>
    </StyledPageToggler>
  );
}

export default PageToggler;
