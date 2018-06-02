import "../css/popup.css";
import Main from "./popup/Main.js";
import React from "react";
import { render } from "react-dom";
import {Provider} from 'react-redux';
import {Store} from 'react-chrome-redux';

const store = new Store({
  portName: 'TRONSCAN_EXT',
});

render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  window.document.getElementById("app-container")
);
