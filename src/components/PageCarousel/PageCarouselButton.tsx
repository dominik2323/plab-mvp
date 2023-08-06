import { PAGES_ANIM_DURATION } from "./pageCarouselConsts";
import React, { ReactNode } from "react";
import { StyledPageCarouselButton } from "./Styles/StyledPageCarouselButton";

interface PageCarouselButtonProps {
  className: string;
  children: ReactNode;
  onClick: () => void;
  direction: number;
}

const PageCarouselButton = ({
  className,
  children,
  onClick,
  direction,
}: PageCarouselButtonProps) => {
  return (
    <StyledPageCarouselButton
      onClick={onClick}
      className={className}
      initial={{ x: `${direction * -100}%` }}
      animate={{ x: `${0}%` }}
      exit={{
        x: `${direction * -100}%`,
        transition: { delay: 0, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ delay: PAGES_ANIM_DURATION, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </StyledPageCarouselButton>
  );
};

export default PageCarouselButton;
