import * as React from "react";
import * as ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { Provider } from "react-redux";
import store from "./store";
import App from "./app/index";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
