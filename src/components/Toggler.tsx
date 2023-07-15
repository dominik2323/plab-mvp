import { animate, animateValue, motion, useAnimate } from "framer-motion";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { PageTogglerContext } from "./PageToggler/pageTogglerContext";

const StyledToggler = styled(motion.div)`
  position: absolute;
  z-index: 1;
  width: 100px;
  height: 100vh;
  top: 0;
  color: white;
  &.work {
    left: unset;
    right: 0;
    background-color: #a947ff;
  }
  &.life {
    left: 0;
    right: unset;
    background-color: black;
  }
`;

function Toggler() {
  const { activePage, setActivePage, shouldUsePageToggler } =
    useContext(PageTogglerContext);
  const [scope, animate] = useAnimate();
  const direction = activePage === 1 ? -1 : 1;

  useEffect(() => {
    const animationTemplate = (value, transition) => {
      return animate(scope.current, value, transition);
    };

    async function showToggler() {
      await animationTemplate({ x: `${0}%` }, { delay: 0.5, duration: 0.3 });
    }
    async function hideToggler(duration) {
      await animationTemplate({ x: `${direction * 100}%` }, { duration });
    }

    async function compoundAnimation() {
      await hideToggler(0);
      await showToggler();
    }
    if (shouldUsePageToggler) {
      compoundAnimation();
    } else {
      hideToggler(0.3);
    }
  }, [scope, direction, animate, shouldUsePageToggler]);

  return (
    <StyledToggler
      key={activePage}
      ref={scope}
      className={activePage === 0 ? "work" : "life"}
      onClick={() => {
        animate(scope.current, { x: `${direction * 100}%` }, {}).then(() => {
          setActivePage((prevPage) => (prevPage === 1 ? 0 : 1));
        });
      }}>
      Go to {activePage === 1 ? "work" : "life"}
    </StyledToggler>
  );
}

export default Toggler;
