import React, { ReactNode } from "react";

import { Row } from "antd";

import { StyledAppRowContainer } from "./index.styled";

type AppRowSimpleContainerProps = {
  children: ReactNode;
};

const AppRowSimpleContainer: React.FC<AppRowSimpleContainerProps> = ({
  children,
}) => {
  return (
    <StyledAppRowContainer>
      <Row gutter={{ xs: 16, sm: 16, md: 32 }}>{children}</Row>
    </StyledAppRowContainer>
  );
};

export default AppRowSimpleContainer;
