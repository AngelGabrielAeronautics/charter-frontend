const Sandstone = {
  "40": "#fffffd",
  "70": "#bfb3b0",
  "100": "#736764",
  "130": "#271b18",
};

const SoftAmber = {
  "40": "#ffffff",
  "70": "#ffffff",
  "100": "#d8c9bb",
  "130": "#8c7d6f",
};

const Linen = {
  "40": "#ffffff",
  "70": "#ffffff",
  "100": "#f9efe4",
  "130": "#ada398",
};

const Charade = {
  "40": "#bdc0ca",
  "70": "#70737d",
  "100": "#242731",
  "130": "#000000",
};

const Tiber = {
  "40": "#a4d0df",
  "70": "#578392",
  "100": "#0B3746",
  "130": "#000000",
};

const themeColors = {
  transparent: "transparent",
  white: "#ffffff",
  black: "#000000",
  grey: Charade[70],
  background: {
    login: "#f2e8dd",
    default: "#eee5e9",
  },
  sandstone: Sandstone,
  light: {
    text: "#242424",
    primary: Tiber[100],
    secondary: Sandstone[100],
    tertiary: Linen[100],
    accent: "#cc2936",
    background: "#eee5e9",
    siderBackground: "#D2D2D2",
    tableHeaderBackground: Tiber[100],
  },
  cardBorder: Tiber[40],
  dark: {
    text: "#EDEDED",
    primary: "#1eaaeb", // indigo_dye 700
    secondary: "#157CAC", // persian_red 700
    tertiary: "#a5b3ba", // slate_gray 700
    accent: "#e57a83", // peach 600
    background: "#323232", // indigo_dye 200
    siderBackground: "#1B1B1B", // indigo_dye 200
    tableHeaderBackground: "#08415c", // lavender_blush 100
  },
};

export default themeColors;
