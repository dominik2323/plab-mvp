import {
  PAGES_ANIM_DURATION,
  CONTROLS_ANIM_DURATION,
} from "./pageCarouselConsts";
import { AnimatePresence, animate } from "framer-motion";
import { useContext, useEffect } from "react";
import { PageCarouselContext } from "./pageCarouselContext";
import PageCarouselButton from "./PageCarouselButton";

function PageCarouselControls() {
  const {
    activePage,
    setActivePage,
    carouselContainerRef,
    shouldUsePageToggler,
    isLayoutChanging,
  } = useContext(PageCarouselContext);

  useEffect(() => {
    if (!shouldUsePageToggler) return;
    if (isLayoutChanging.current) return;

    const goToLifeAnimation = async () => {
      await animate(
        carouselContainerRef.current,
        { x: "-50%" },
        {
          ease: [0.22, 1, 0.36, 1],
          duration: PAGES_ANIM_DURATION,
          delay: CONTROLS_ANIM_DURATION,
        }
      );
    };

    const goToWorkAnimation = async () => {
      await animate(
        carouselContainerRef.current,
        { x: "0%" },
        {
          ease: [0.22, 1, 0.36, 1],
          duration: PAGES_ANIM_DURATION,
          delay: CONTROLS_ANIM_DURATION,
        }
      );
    };

    activePage === 1 ? goToLifeAnimation() : goToWorkAnimation();
  }, [activePage, shouldUsePageToggler, isLayoutChanging]);

  return (
    <AnimatePresence mode={"wait"}>
      {shouldUsePageToggler && activePage === 1 && (
        <PageCarouselButton
          key={"work"}
          direction={1}
          className={"bg-black pos-left"}
          onClick={() => {
            setActivePage(0);
          }}>
          Go to work
        </PageCarouselButton>
      )}
      {shouldUsePageToggler && activePage === 0 && (
        <PageCarouselButton
          key={"life"}
          direction={-1}
          className={"bg-purple pos-right"}
          onClick={() => {
            setActivePage(1);
          }}>
          Go to life
        </PageCarouselButton>
      )}
    </AnimatePresence>
  );
}

export default PageCarouselControls;
