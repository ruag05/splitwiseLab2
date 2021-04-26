import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import store from './reducer/store';
import { Provider } from 'react-redux';


axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const options = {
  timeout: 4000,
  position: positions.TOP_CENTER,
};

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <AuthProvider>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </AuthProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
