import React from "react";
import styled from "styled-components";

const StyledPage = styled.div`
  height: 300vh;
  width: 100vw;
  flex-shrink: 0;
  padding-top: 100px;
  background: linear-gradient(${({ colors }) => `${colors[0]}, ${colors[1]}`});
`;

export default function Page({ colors, children }) {
  return <StyledPage colors={colors}>{children}</StyledPage>;
}
