import React from "react";
import { theme as chakraTheme } from "@chakra-ui/react";

const theme = {
  colors: {
    primary: {
      400: "rgb(31, 34, 51)",
      500: "#131a26",
    },
    secondary: {
      500: "#3bd671",
      600: "#3bd671",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      "html, body": {
        fontSize: "md",
        backgroundColor: props.colorMode === "dark" ? "primary.400" : "white",
        lineHeight: "tall",
      },
    }),
  },
  ...chakraTheme,
};

export default theme;
