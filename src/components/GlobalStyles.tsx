import { Global } from "@emotion/react";
import { colors } from "@scripts/colors";

const GlobalStyles = () => (
  <Global
    styles={{
      html: {
        height: "-webkit-fill-available",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
      },
      "#root": {
        height: "-webkit-fill-available",
      },
      "p,h1,h2,h3,h4,h5,h6": {
        margin: 0,
      },
      "ul,li": {
        padding: 0,
        margin: 0,
      },
      focus: {
        width: 2,
        offset: 2,
      },
      body: {
        height: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
        padding: 0,
        margin: 0,
        fontFamily: "Arial",
      },
      hr: {
        borderColor: colors.grey400,
        borderWidth: "1px 0 0 0",
        borderStyle: "solid",
        height: 1,
      },
    }}
  />
);
export default GlobalStyles;
