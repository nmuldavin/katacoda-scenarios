import { useState, useEffect } from "react";

interface Tweet {
  author: string;
  text: string;
}

// Placeholder
const CURRENT_USER = "alice@dashdogs.com";

export default function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState<string>("");

  async function getTweets() {
    const response = await fetch("/tweets");
    const data = await response.json();
    setTweets(data.tweets);
  }

  async function postTweet(text: string) {
    if (!text.length) {
      return;
    }

    await fetch("/tweets", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        author: CURRENT_USER,
      }),
    });

    setNewTweet("");
    getTweets();
  }

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white"
        style={{ width: "380px;" }}
      >
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom justify-content-between">
          <span className="fs-5 fw-semibold">Tweets</span>
          <small className="text-muted">{CURRENT_USER}</small>
        </div>

        <div className="p-3 text-decoration-none">
          <textarea
            placeholder="Your tweet here"
            className="form-control"
            id="exampleFormControlTextarea1"
            value={newTweet}
            rows={3}
            onChange={(e) => {
              setNewTweet(e.target.value);
            }}
          ></textarea>
        </div>

        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark  border-bottom">
          <button
            type="submit"
            className="btn btn-primary mb-3"
            onClick={() => {
              postTweet(newTweet);
            }}
          >
            Tweet
          </button>
        </div>

        <div className="list-group list-group-flush border-bottom scrollarea">
          {tweets.map((t) => {
            return (
              <a className="list-group-item list-group-item-action lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{t.author}</strong>
                </div>
                <div className="col-10 mb-1 small">{t.text}</div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
