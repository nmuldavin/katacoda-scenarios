import { init } from "@datadog/ui-apps-sdk";
import { useState, useEffect } from "react";
import "./../index.css";
import React from "react";
import { API_URL } from "../api";

const client = init({ debug: true });

export default function AccountPanel() {
  const [tweets, setTweets] = useState<{ text: string; author: string }[]>([]);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    client.getContext().then(({ args }) => setAccount(args.account));
  }, []);

  async function getTweets() {
    const response = await fetch(`${API_URL}/tweets`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setTweets(data.tweets);
  }

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <div className="container">
      {tweets.length > 0 && (
        <div className="list-group list-group-flush border-bottom scrollarea">
          {tweets.map((t) => {
            return (
              <div className="list-group-item list-group-item-action lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{account}</strong>
                </div>
                <div className="col-10 mb-1 small">{t.text}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
