import Page from "./components/Page";
import PageCarousel from "./components/PageCarousel/PageCarousel";
import PageCarouselControls from "./components/PageCarousel/PageCarouselControls";
import styled from "styled-components";

export const StyledHomepage = styled.div`
  width: 100vw;
`;

function Homepage() {
  return (
    <StyledHomepage>
      <PageCarouselControls />
      <PageCarousel>
        <Page height={"300vh"} colors={["#FFFFFF", "#000000"]}>
          <span>WORK</span>
        </Page>
        <Page height={"300vh"} colors={["#A947FF", "#FAF4FF"]}>
          <span>LIFE</span>
        </Page>
      </PageCarousel>
    </StyledHomepage>
  );
}

export default Homepage;
