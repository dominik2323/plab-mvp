import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledPageCarouselButton = styled(motion.div)`
  position: absolute;
  z-index: 1;
  width: 100px;
  height: 100vh;
  color: white;
  &.pos-left {
    left: 0;
    right: unset;
  }
  &.pos-right {
    left: unset;
    right: 0;
  }
  &.bg-purple {
    background-color: #a947ff;
  }
  &.bg-black {
    background-color: black;
  }
`;
