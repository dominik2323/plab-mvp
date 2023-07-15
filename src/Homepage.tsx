import Page from "./components/Page";
import PageToggler from "./components/PageToggler/PageToggler";
import Toggler from "./components/Toggler";
import styled from "styled-components";

export const StyledHomepage = styled.div`
  width: 100vw;
`;

function Homepage() {
  return (
    <StyledHomepage>
      <Toggler />
      <PageToggler>
        <Page height={"300vh"} colors={["#FFFFFF", "#000000"]}>
          <span>WORK</span>
        </Page>
        <Page height={"250vh"} colors={["#A947FF", "#FAF4FF"]}>
          <span>LIFE</span>
        </Page>
      </PageToggler>
    </StyledHomepage>
  );
}

export default Homepage;
