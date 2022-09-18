import { colors } from "@scripts/colors";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "@containers/utility/Periphery/Sidebar";
import PeripheryPage from "./[Periphery]";

// TODO: https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md

const Periphery = () => (
  <BrowserRouter>
    <Allotment>
      <Allotment.Pane minSize={250} preferredSize={250}>
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
