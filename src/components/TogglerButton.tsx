import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { SWITCH_PAGES_DURATION } from "./Toggler";

interface TogglerButtonProps {
  className: string;
  children: ReactNode;
  onClick: () => void;
  direction: number;
}

const StyledTogglerButton = styled(motion.div)`
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

export const SWITCH_TOGGLES_DURATION = 0.3 as const;

const TogglerButton = ({
  className,
  children,
  onClick,
  direction,
}: TogglerButtonProps) => {
  return (
    <StyledTogglerButton
      onClick={onClick}
      className={className}
      initial={{ x: `${direction * -100}%` }}
      animate={{ x: `${0}%` }}
      exit={{
        x: `${direction * -100}%`,
        transition: { delay: 0, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ delay: SWITCH_PAGES_DURATION, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </StyledTogglerButton>
  );
};

export default TogglerButton;
