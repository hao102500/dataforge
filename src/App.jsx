import React from "react";
import { App as AntdApp } from "antd";

import Workbench from "./pages/Workbench";

export default function App() {
  return (
    <AntdApp>
      <Workbench />
    </AntdApp>
  );
}
