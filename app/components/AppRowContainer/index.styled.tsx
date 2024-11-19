import styled from "styled-components";

import { breakpoints } from "@/app/(config)/constants";

export const StyledAppRowContainer = styled.div`
  & .ant-row {
    & > .ant-col {
      margin-bottom: 16px;

      & .card-outer-title {
        margin-bottom: 16px;
      }

      @media screen and (min-width: ${breakpoints.md}px) {
        margin-bottom: 32px;
      }

      .ant-form & {
        margin-bottom: 0;
      }
    }

    &.ant-form-item > .ant-col {
      margin-bottom: 0;
    }
  }
`;
