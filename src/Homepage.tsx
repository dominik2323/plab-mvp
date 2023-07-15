import React, { useContext } from "react";
import PageToggler from "./components/PageToggler/PageToggler";
import Page from "./components/Page";
import Toggler from "./components/Toggler";
import { PageTogglerContext } from "./components/PageToggler/pageTogglerContext";

function Homepage() {
  const { setActivePage, shouldUsePageToggler } =
    useContext(PageTogglerContext);

  return (
    <PageToggler>
      <Page height={"300vh"} colors={["#FFFFFF", "#000000"]}>
        <span>WORK</span>
        {shouldUsePageToggler && (
          <Toggler
            onClick={() => {
              setActivePage(1);
            }}>
            work
          </Toggler>
        )}
      </Page>
      <Page height={"250vh"} colors={["#A947FF", "#FAF4FF"]}>
        <span>LIFE</span>
        {shouldUsePageToggler && (
          <Toggler
            onClick={() => {
              setActivePage(0);
            }}>
            life
          </Toggler>
        )}
      </Page>
    </PageToggler>
  );
}

export default Homepage;
