import type { ThemeConfig } from "antd";

import themeColors from "./colors";

const theme: ThemeConfig = {
  components: {
    Avatar: {},
    Layout: {
      headerBg: themeColors.light.background,
      footerBg: themeColors.light.background,
      siderBg: themeColors.light.siderBackground,
      triggerColor: themeColors.light.background,
      lightTriggerBg: themeColors.light.background,
      headerPadding: 0,
    },
    Menu: {
      itemActiveBg: themeColors.light.primary,
      itemBorderRadius: 0,
      borderRadius: 60,
      horizontalItemHoverBg: "rgb(118,53,53)",
      horizontalItemHoverColor: "rgb(65,96,140)",
      itemBg: themeColors.light.primary,
      itemColor: "#BCBDB7",
      itemSelectedBg: "#0B3746",
      itemSelectedColor: "#BCBDB7",
      borderRadiusLG: 0,
      colorText: "#BCBDB7",
    },
    Checkbox: {
      borderRadiusSM: 4,
      fontSize: 14,
      lineHeight: 2.5714285714285716,
      lineWidth: 2,
    },
    Table: {
      borderRadius: 20,
      headerBorderRadius: 10,
      colorBgContainer: "#E9E2DB",
      padding: 25,
      stickyScrollBarBorderRadius: 100,
      cellFontSize: 12,
      colorText: "rgb(66,69,79)",
      colorTextHeading: "rgb(66,69,79)",
      lineWidth: 2,
      fontSize: 0,
      footerColor: themeColors.light.primary,
    },
    List: {
      headerBg: themeColors.light.primary,
    },
    Pagination: {
      colorText: themeColors.light.primary,
      itemActiveColorDisabled: themeColors.light.primary,
    },
    Button: {
      defaultGhostBorderColor: themeColors.grey,
      defaultGhostColor: themeColors.grey,
    },
  },
  token: {
    fontSize: 14,
    colorBgLayout: themeColors.light.background,
    colorPrimary: themeColors.light.primary,
    colorPrimaryBorder: themeColors.light.secondary,
    boxShadow: themeColors.transparent,
    boxShadowSecondary: themeColors.transparent,
    colorLink: themeColors.light.primary,
  },
};

export default theme;
