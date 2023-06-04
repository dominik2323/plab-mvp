import React, { useContext } from "react";
import PageToggler from "./components/PageWrapper";
import Page from "./components/Page";
import Toggler from "./components/Toggler";
import { ActivePageContext } from "./App";

function Homepage() {
  const { activePage, setActivePage } = useContext(ActivePageContext);

  return (
    <PageToggler>
      <Page colors={["#ffffff", "#000000"]}>
        <span>WORK</span>
        {activePage !== null && (
          <Toggler
            onClick={() => {
              setActivePage(1);
            }}>
            work
          </Toggler>
        )}
      </Page>
      <Page colors={["#A947FF", "#FAF4FF"]}>
        <span>LIFE</span>
        {activePage !== null && (
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
