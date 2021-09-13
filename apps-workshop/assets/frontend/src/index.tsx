import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import setup from "./controller";
import BlocklistModal from "./blocklist-modal";
import AccountPanel from "./account-panel";
import Widget from "./widget";
import ModalHowTo from "./blocklist-modal/howto";

const getContent = () => {
  console.log(window.location.pathname);
  switch (window.location.pathname) {
    case "/widget": {
      return <Widget />;
    }
    case "/blocklist-modal": {
      return <BlocklistModal />;
    }
    case "/modal-howto": {
      return <ModalHowTo />;
    }
    case "/account-panel": {
      return <AccountPanel />;
    }
    default: {
      setup();
    }
  }
};

ReactDOM.render(
  <React.StrictMode>{getContent()}</React.StrictMode>,
  document.getElementById("root")
);
