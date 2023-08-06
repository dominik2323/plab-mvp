import { useAnimate } from "framer-motion";
import { Fragment, useContext, useEffect, useRef } from "react";
import {
  StyledPageCarousel,
  CarouselContainer,
} from "./Styles/StyledPageCarousel";
import { gridAreasMatrix } from "./pageCarouselConsts";
import { PageCarouselContext } from "./pageCarouselContext";

interface PageCarouselProps {
  children: JSX.Element[];
}

type VPos = 0 | 1 | 2;

function PageCarousel({ children }: PageCarouselProps) {
  const {
    activePage,
    setActivePage,
    setShouldUsePageToggler,
    carouselContainerRef,
    isLayoutChanging,
  } = useContext(PageCarouselContext);
  const [scope, animate] = useAnimate();

  const pageCarouselRef = useRef<HTMLDivElement>(null);
  const vPos = useRef<VPos>(0);
  const prevVPos = useRef<VPos>(vPos.current);
  const prevScrollTop = useRef<number>(0);
  const scrollDirection = useRef<-1 | 0 | 1>(0);
  const rafId = useRef<number>(null);

  useEffect(() => {
    const setLayout = (layout, motionValue) => {
      isLayoutChanging.current = true;
      animate(carouselContainerRef.current, motionValue, { duration: 0 }).then(
        () => {
          carouselContainerRef.current.style.gridTemplateAreas = layout;
          isLayoutChanging.current = false;
        }
      );
    };

    const raf = () => {
      const scrollTop = pageCarouselRef.current.scrollTop;

      if (scrollTop !== prevScrollTop.current) {
        scrollDirection.current =
          scrollTop - prevScrollTop.current > 0 ? 1 : -1;
        prevScrollTop.current = scrollTop;

        const viewportHeight = pageCarouselRef.current.clientHeight;
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
  }, [
    setActivePage,
    setShouldUsePageToggler,
    animate,
    activePage,
    carouselContainerRef,
    pageCarouselRef,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const topPage = document.querySelector(`.p0`);
      const bottomPage = document.querySelector(`.p1`);
      const topPageCopy = document.querySelector(`.p0c`) as HTMLElement;
      const bottomPageCopy = document.querySelector(`.p1c`) as HTMLElement;

      topPageCopy.style.height = `${topPage.clientHeight}px`;
      bottomPageCopy.style.height = `${bottomPage.clientHeight}px`;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyledPageCarousel ref={pageCarouselRef}>
      <CarouselContainer ref={carouselContainerRef}>
        {children.map((c, i) => (
          <Fragment key={i}>
            <div className={`p${i}`}>{c}</div>
            <div className={`p${i}c`} />
          </Fragment>
        ))}
      </CarouselContainer>
    </StyledPageCarousel>
  );
}

export default PageCarousel;
