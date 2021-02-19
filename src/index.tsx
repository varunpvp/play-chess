import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Loader from "./components/loader";
import App from "./app";
import { FirebaseAuth } from "./config/firebase";

let isAppRendered = false;

ReactDOM.render(<Loader />, document.getElementById("root"));

function renderApp() {
  if (!isAppRendered) {
    ReactDOM.render(<App />, document.getElementById("root"));
    isAppRendered = true;
  }
}

FirebaseAuth.onAuthStateChanged((user) => {
  if (user) {
    renderApp();
  } else {
    FirebaseAuth.signInAnonymously().then(() => renderApp());
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
