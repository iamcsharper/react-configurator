import Accordion from "@components/controls/Accordion";
import { colors } from "@scripts/colors";
import { scale } from "@scripts/helpers";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import PeripheryPage from "./[Periphery]";

// TODO: https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md

const Sidebar = () => (
  <>
    <h4>My sidebar</h4>
    <Accordion allowZeroExpanded={false} preExpanded={["1"]}>
      <Accordion.Item uuid="1">
        <Accordion.Heading>
          <Accordion.Button>Ядро</Accordion.Button>
        </Accordion.Heading>
        <Accordion.Panel>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: scale(1),
            }}
          >
            <Link to="/rtc">??</Link>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item uuid="2">
        <Accordion.Heading>
          <Accordion.Button>Таймеры</Accordion.Button>
        </Accordion.Heading>
        <Accordion.Panel>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: scale(1),
            }}
          >
            <Link to="/rtc">RTC</Link>
            <Link to="/rtc">RTC 1</Link>
            <Link to="/rtc">RTC 2</Link>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  </>
);

const Periphery = () => (
  <BrowserRouter>
    <Allotment>
      <Allotment.Pane minSize={200} preferredSize={200}>
        <Sidebar />
      </Allotment.Pane>
      <Allotment.Pane>
        <Routes>
          <Route path="/">
            <Route path=":id" element={<PeripheryPage />} />
          </Route>
        </Routes>
      </Allotment.Pane>
      <Allotment.Pane>
        <div
          css={{
            background: colors.grey300,
            height: "100%",
            width: "100%",
          }}
        />
      </Allotment.Pane>
    </Allotment>
  </BrowserRouter>
);

export default Periphery;
