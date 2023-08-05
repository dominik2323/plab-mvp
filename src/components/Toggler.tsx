import { animate, animateValue, motion, useAnimate } from "framer-motion";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { PageTogglerContext } from "./PageToggler/pageTogglerContext";

const StyledToggler = styled(motion.div)`
  position: absolute;
  z-index: 1;
  width: 100px;
  height: 100vh;
  color: white;
  &.work {
    background-color: #a947ff;
  }
  &.life {
    background-color: black;
  }
`;
const resolvePromisesSeq = async (tasks) => {
  for (const task of tasks) {
    await task();
  }
};

const showWorkTogglerConfig = [
  {
    values: { x: `100%`, right: `0%`, left: `unset`, opacity: 0 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `100%`, right: `0%`, left: `unset`, opacity: 1 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `0%`, right: `0%`, left: `unset`, opacity: 1 },
    transition: { duration: 0.3, delay: 0 },
  },
];

const showLifeTogglerConfig = [
  {
    values: { x: `-100%`, left: `0%`, right: `unset`, opacity: 0 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `-100%`, left: `0%`, right: `unset`, opacity: 1 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `0%`, left: `0%`, right: `unset`, opacity: 1 },
    transition: { duration: 0.3, delay: 0 },
  },
];

const hideWorkTogglerConfig = [
  {
    values: { x: `0%`, right: `0%`, left: `unset`, opacity: 1 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `100%`, right: `0%`, left: `unset`, opacity: 1 },
    transition: { duration: 0.3, delay: 0 },
  },
  {
    values: { x: `100%`, right: `0%`, left: `unset`, opacity: 0 },
    transition: { duration: 0, delay: 0 },
  },
];
const hideLifeTogglerConfig = [
  {
    values: { x: `0%`, left: `0%`, right: `unset`, opacity: 1 },
    transition: { duration: 0, delay: 0 },
  },
  {
    values: { x: `-100%`, left: `0%`, right: `unset`, opacity: 1 },
    transition: { duration: 0.3, delay: 0 },
  },
  {
    values: { x: `-100%`, left: `0%`, right: `unset`, opacity: 0 },
    transition: { duration: 0, delay: 0 },
  },
];

function Toggler() {
  const {
    activePage,
    setActivePage,
    shouldUsePageToggler,
    toggleContainerRef,
    isLayoutChanging,
  } = useContext(PageTogglerContext);
  const [scope, animate] = useAnimate();

  const createAnimationFromConfig = (config: typeof showWorkTogglerConfig) => {
    return config.reduce((acc, curr, i, original) => {
      return [
        ...acc,
        async () => {
          await animate(scope.current, curr.values, curr.transition);
          return { values: curr.values, transition: curr.transition };
        },
      ];
    }, []);
  };

  const showWorkTogglerAnimation = createAnimationFromConfig(
    showWorkTogglerConfig
  );
  const hideWorkTogglerAnimation = createAnimationFromConfig(
    hideWorkTogglerConfig
  );

  const showLifeTogglerAnimation = createAnimationFromConfig(
    showLifeTogglerConfig
  );
  const hideLifeTogglerAnimation = createAnimationFromConfig(
    hideLifeTogglerConfig
  );

  useEffect(() => {
    // if (isLayoutChanging.current) return;
    if (!shouldUsePageToggler) return;

    const goToLifeAnimation = async () => {
      await animate(
        toggleContainerRef.current,
        { x: "-50%" },
        { ease: [0.22, 1, 0.36, 1], duration: 0.7 }
      );
      await resolvePromisesSeq(showLifeTogglerAnimation);
    };

    const goToWorkAnimation = async () => {
      await animate(
        toggleContainerRef.current,
        { x: "0%" },
        { ease: [0.22, 1, 0.36, 1], duration: 0.7 }
      );
      await resolvePromisesSeq(showWorkTogglerAnimation);
    };

    activePage === 1 ? goToLifeAnimation() : goToWorkAnimation();
  }, [activePage, isLayoutChanging, shouldUsePageToggler]);

  useEffect(() => {
    if (!shouldUsePageToggler) {
      activePage === 1
        ? resolvePromisesSeq(hideLifeTogglerAnimation)
        : resolvePromisesSeq(hideWorkTogglerAnimation);
    }
    if (shouldUsePageToggler) {
      activePage === 1
        ? resolvePromisesSeq(showLifeTogglerAnimation)
        : resolvePromisesSeq(showWorkTogglerAnimation);
    }
  }, [shouldUsePageToggler, activePage]);

  return (
    <StyledToggler
      ref={scope}
      className={activePage === 0 ? "work" : "life"}
      onClick={async () => {
        if (activePage === 0) {
          await resolvePromisesSeq(hideWorkTogglerAnimation);
          setActivePage(1);
          return;
        }
        await resolvePromisesSeq(hideLifeTogglerAnimation);
        setActivePage(0);
      }}>
      Go to {activePage === 1 ? "work" : "life"}
    </StyledToggler>
  );
}

export default Toggler;
