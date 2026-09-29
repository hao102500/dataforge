import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";

import App from "./App.jsx";

import "./styles/tokens.css";
import "./styles/global.css";

const theme = {
  token: {
    colorPrimary: "#5B5BD6",

    colorSuccess: "#16A34A",
    colorWarning: "#D97706",
    colorError: "#DC2626",
    colorInfo: "#2563EB",

    colorText: "#18181B",
    colorTextSecondary: "#52525B",

    colorBgBase: "#FFFFFF",
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#F7F8FA",

    colorBorder: "#E4E4E7",
    colorBorderSecondary: "#F0F0F2",

    borderRadius: 8,
    borderRadiusLG: 16,

    controlHeight: 36,

    fontSize: 14,

    fontFamily: [
      "Geist",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"PingFang SC"',
      '"Microsoft YaHei"',
      "sans-serif",
    ].join(","),
  },

  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 8,
      fontWeight: 500,
    },

    Input: {
      controlHeight: 36,
      borderRadius: 8,
    },

    Select: {
      controlHeight: 36,
      borderRadius: 8,
    },

    Card: {
      borderRadiusLG: 16,
    },

    Modal: {
      borderRadiusLG: 16,
    },

    Table: {
      headerBg: "#FAFAFB",
      headerColor: "#52525B",
      borderColor: "#F0F0F2",
      rowHoverBg: "#FAFAFC",
    },
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
