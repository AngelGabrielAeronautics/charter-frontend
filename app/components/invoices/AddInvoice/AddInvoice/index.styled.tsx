import styled from "styled-components";

export const StyledClientWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  padding: 12px;
  width: 80%;

  .closeBtn {
    display: none;
  }
  &:hover {
    .closeBtn {
      display: block;
    }
  }
`;

export const StyledCloseBtn = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export const StyledInumWrapper = styled.div<{ editInum: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px;

  span {
    min-width: 70px;
  }

  &:hover {
    border: 1px solid
      
`;

export const StyledItdWrapper = styled.div<{ editIdt: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px;

  span {
    min-width: 70px;
  }

  &:hover {
    border: 1px solid;
  }
`;

export const StyledDueWrapper = styled.div<{ editDueDays: boolean }>`
  border-radius: 8px;
  padding: 4px;

  &:hover {
    border: 1px solid;
  }
`;

export const StyledPrimaryText = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledPrimaryText2 = styled.div``;

export const StyledBankAccountWrapper = styled.div`
  position: relative;
  padding: 12px;
  margin: 16px 0;
  border-radius: 8px;
  width: fit-content;
`;
