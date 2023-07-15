import { motion } from "framer-motion";
import styled from "styled-components";
import { gridAreasMatrix } from "../pageTogglerConsts";

export const StyledPageToggler = styled.div`
  overflow-x: hidden;
  overflow-anchor: none;
  // we have to scroll on the y axis inside this element in order to enable sticky el for the page toggler
  height: 100vh;
`;
export const TogglerContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 100vw);
  grid-template-areas: ${gridAreasMatrix[0][0]};
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
