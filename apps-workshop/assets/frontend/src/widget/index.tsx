import { init, ModalSize } from "@datadog/ui-apps-sdk";
import "./../index.css";
import { WORKSHOP_COMPLETED } from "../workshop";
import { API_URL } from "../api";

import "./widget.css";
import "typeface-roboto";
import "bootstrap/dist/css/bootstrap.css";

import filename from "./filename.png";
import code from "./code.png";

import React, { useEffect, useState } from "react";

const client = init({ debug: true });

const setRateLimit = (value: number) => {
  fetch(`${API_URL}/limits`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
    }),
  });
};

export default function Widget() {
  const onBlockUser = (args: any) => {
    client.modal.open({
      source: "blocklist-modal",
      key: "custom-modal",
      title: "Add to blocklist",
      size: ModalSize.LARGE,
    });
  };

  // Workshop step #6.
  // Remove the lines below.
  if (!WORKSHOP_COMPLETED) {
    return (
      <section className="p-3">
        <div>
          <h1>Hello world</h1>
          <span> You will modify this code in step 6.</span>
        </div>
        <div>
          <div>Open your editor and find widget.tsx</div>
          <img className="mb-3" src={filename} alt="filename" />
          <div>
            Find the following code and remove it to proceed to the next step
          </div>
          <img src={code} alt="code" />
        </div>
      </section>
    );
  }
  // Workshop step #6. Remove the lines above.
  // > End here <

  return (
    <section style={{ padding: "10px" }}>
      <div className="container-fluid">
        <div> Search Endpoint configuration</div>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setRateLimit(0.3);
            }}
          >
            Enable sampling (30%)
          </button>
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setRateLimit(100);
            }}
          >
            Disable sampling
          </button>
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setRateLimit(0);
            }}
          >
            Drop all requests
          </button>
        </div>

        <div className="row">
          <div> Users</div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBlockUser}
          >
            Block user
          </button>
        </div>
      </div>
    </section>
  );
}
