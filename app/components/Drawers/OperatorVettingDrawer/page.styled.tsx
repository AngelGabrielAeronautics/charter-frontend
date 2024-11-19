import { Form, Tabs } from "antd";
import styled from "styled-components";

import themeColors from "@/app/(config)/colors";

export const StyledUserProfileForm = styled(Form)`
  position: relative;
`;

export const StyledUserProfileFormTitle = styled.h3`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  margin-bottom: 16px;
`;

export const StyledUserProfileGroupBtn = styled(Form.Item)`
  position: relative;

  & .ant-btn {
    & + .ant-btn {
      margin-left: 12px;

      [dir="rtl"] & {
        margin-left: 0;
        margin-right: 12px;
      }
    }
  }
`;

export const StyledProfileNotification = styled.div`
  position: relative;

  & + .profile-notification {
    margin-left: -20px;
    margin-right: -20px;
    margin-top: 16px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme.palette.borderColor};
  }
`;

export const StyledNotificationList = styled.div`
  position: relative;
`;

export const StyledNotificationListItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  & .label {
    margin-left: 15px;

    [dir="rtl"] & {
      margin-left: 0;
      margin-right: 15px;
    }
  }
`;

export const StyledUserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 20px;
`;

export const StyledUserProfileTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 600px) {
    flex-direction: row;
  }

  &.ant-tabs-left
    > .ant-tabs-content-holder
    > .ant-tabs-content
    > .ant-tabs-tabpane,
  &.ant-tabs-left
    > div
    > .ant-tabs-content-holder
    > .ant-tabs-content
    > .ant-tabs-tabpane {
    padding-left: 20px;
  }

  & .ant-tabs-nav {
    min-width: 200px;
    background-color: #ebe5df;
    border-radius: 12px;
    padding: 20px 0;

    @media screen and (min-width: px) {
      min-width: 280px;
    }

    & .ant-tabs-tab {
      color: black;
      display: flex;
      align-items: center;
      padding: 12px 24px;
      margin-right: 20px !important;
      border-radius: 0 10px 10px 0;

      .ant-tabs-tab-btn {
        width: 100%;
      }

      &:hover,
      &:focus {
        background-color: transparent;
        color: black;
      }

      [dir="rtl"] & {
        margin-right: 0 !important;
        margin-left: 20px !important;
        border-radius: 10px 0 0 10px;
      }

      & + .ant-tabs-tab {
        margin-top: 1px;
      }
    }

    & .ant-tabs-tab-active {
      color: white !important;
      background-color: #0b3746;

      &:hover,
      &:focus {
        color: white !important;
        background-color: #0b3746;
      }
    }

    & .ant-tabs-ink-bar {
      display: none;
    }
  }

  & .user-profile-icon {
    display: flex;
    align-items: center;

    & .icon {
      font-size: 1rem;
      margin-right: 16px;

      [dir="rtl"] & {
        margin-right: 0;
        margin-left: 16px;
      }
    }
  }

  & .ant-tabs-content-holder {
    padding-top: 20px;
    border: none;
    [dir="rtl"] & {
      order: 2;
    }

    @media screen and (min-width: 600px) {
      padding-left: 20px;
      padding-top: 0;

      [dir="rtl"] & {
        padding-left: 0;
        padding-right: 20px;
      }
    }

    @media screen and (min-width: 1200px) {
      padding-left: 32px;

      [dir="rtl"] & {
        padding-left: 0;
        padding-right: 32px;
      }
    }
  }

  & .ant-tabs-content {
    background-color: #ebe5df;
    border-radius: 8px;
    height: 100%;
    padding: 20px;

    & .ant-form-item {
      margin-bottom: 16px;
    }

    & .user-profile-group-btn {
      margin-bottom: 0;
    }
  }
`;
