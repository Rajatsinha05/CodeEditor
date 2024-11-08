import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

      <BrowserRouter>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </Provider>
      </BrowserRouter>
 
  </React.StrictMode>
);
