// import Tabs from "@components/controls/Tabs";
import GlobalStyles from "@components/GlobalStyles";
import { useState } from "react";
import Tabs from "./components/controls/Tabs";
import Periphery from "./views/Periphery";

// https://redux.js.org/usage/configuring-your-store

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStyles />
      <Tabs
        css={{ height: "100%", display: "flex", flexDirection: "column" }}
        panelFillsHeight
      >
        <Tabs.List horizontalScroll>
          <Tabs.Tab>Периферия</Tabs.Tab>
          <Tabs.Tab>Clock</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <Periphery />
        </Tabs.Panel>
        <Tabs.Panel>123123</Tabs.Panel>
      </Tabs>
    </>
  );
}

export default App;
