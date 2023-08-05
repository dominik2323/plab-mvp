import { AnimatePresence, animate } from "framer-motion";
import { useContext, useEffect } from "react";
import { PageTogglerContext } from "./PageToggler/pageTogglerContext";
import TogglerButton, { SWITCH_TOGGLES_DURATION } from "./TogglerButton";

export const SWITCH_PAGES_DURATION = 0.7 as const;

function Toggler() {
  const {
    activePage,
    setActivePage,
    toggleContainerRef,
    shouldUsePageToggler,
    isLayoutChanging,
  } = useContext(PageTogglerContext);

  useEffect(() => {
    if (!shouldUsePageToggler) return;
    if (isLayoutChanging.current) return;

    const goToLifeAnimation = async () => {
      await animate(
        toggleContainerRef.current,
        { x: "-50%" },
        {
          ease: [0.22, 1, 0.36, 1],
          duration: SWITCH_PAGES_DURATION,
          delay: SWITCH_TOGGLES_DURATION,
        }
      );
    };

    const goToWorkAnimation = async () => {
      await animate(
        toggleContainerRef.current,
        { x: "0%" },
        {
          ease: [0.22, 1, 0.36, 1],
          duration: SWITCH_PAGES_DURATION,
          delay: SWITCH_TOGGLES_DURATION,
        }
      );
    };

    activePage === 1 ? goToLifeAnimation() : goToWorkAnimation();
  }, [activePage, shouldUsePageToggler, isLayoutChanging]);

  return (
    <AnimatePresence mode={"wait"}>
      {shouldUsePageToggler && activePage === 1 && (
        <TogglerButton
          key={"work"}
          direction={1}
          className={"bg-black pos-left"}
          onClick={() => {
            setActivePage(0);
          }}>
          Go to work
        </TogglerButton>
      )}
      {shouldUsePageToggler && activePage === 0 && (
        <TogglerButton
          key={"life"}
          direction={-1}
          className={"bg-purple pos-right"}
          onClick={() => {
            setActivePage(1);
          }}>
          Go to life
        </TogglerButton>
      )}
    </AnimatePresence>
  );
}

export default Toggler;
