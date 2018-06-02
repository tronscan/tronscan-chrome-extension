import "../css/popup.css";
import Main from "./popup/Main.js";
import React from "react";
import { render } from "react-dom";

render(
  <Main/>,
  window.document.getElementById("app-container")
);
