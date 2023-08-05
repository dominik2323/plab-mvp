import React from "react";

export type ActivePage = 0 | 1;

export type PageTogglerContextType = {
  activePage: ActivePage;
  setActivePage: React.Dispatch<React.SetStateAction<ActivePage>>;
  shouldUsePageToggler: boolean;
  setShouldUsePageToggler: React.Dispatch<React.SetStateAction<boolean>>;
  toggleContainerRef: React.MutableRefObject<HTMLDivElement>;
  isLayoutChanging: React.MutableRefObject<boolean>;
};

export const PageTogglerContext =
  React.createContext<PageTogglerContextType>(null);
