import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "../redux/store";
import Routes from "../components/Routes";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Routes />
    </ReduxProvider>
  );
}
