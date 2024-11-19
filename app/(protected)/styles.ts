"use client";

import themeColors from "../(config)/colors";

export const layoutStyle: React.CSSProperties = {
  background: "#EFEFEFF0",
  height: "100vh",
  minHeight: "100vh",
};

export const headerStyle: React.CSSProperties = {
  background: themeColors.light.primary,
  color: themeColors.white,
  position: "fixed",
  top: 0,
  zIndex: 1,
  width: "100%",
  height: "8vh",
  display: "flex",
  justifyContent: "space-between",
  padding: ".25rem 1rem",
};

export const siderStyle: React.CSSProperties = {
  top: "8vh",
  left: 0,
  height: "92vh",
  overflow: "auto",
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
  padding: 10,
  backgroundColor: themeColors.light.primary,
};

export const contentStyle: React.CSSProperties = {
  background: "#EFEFEFF0",
  padding: "2rem 3.5rem",
  top: "8vh",
  marginTop: "8vh",
  height: "92vh",
  overflow: "auto",
  backgroundColor: "#F7F2EC",
};

export const footerStyle: React.CSSProperties = {
  background: "#FFFFFFC2",
  position: "fixed",
  textAlign: "center",
  width: "100%",
  bottom: 0,
  height: "5vh",
  lineHeight: "5vh",
  padding: "0 1.5rem",
  zIndex: 1,
};
