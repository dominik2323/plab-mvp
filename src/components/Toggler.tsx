import React from "react";
import styled from "styled-components";

const StyledToggler = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

function Toggler({ onClick, children }) {
  return <StyledToggler onClick={onClick}>Toggler {children}</StyledToggler>;
}

export default Toggler;
