import { useState, useEffect } from "react";
import { API_URL } from "../api";
import "./../index.css";

export default function BlocklistModal() {
  const [email, setEmail] = useState<string>("");
  const [blockList, setBlockList] = useState<string[]>([]);

  async function updateBlocklist() {
    const response = await fetch(`${API_URL}/blocklist`);
    const data = await response.json();
    setBlockList(data.users);
  }

  async function addToBlocklist() {
    await fetch(`${API_URL}/blocklist`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    updateBlocklist();
  }

  useEffect(() => {
    updateBlocklist();
  }, []);

  return (
    <div className="container">
      {/* SHOW BLOCKLIST ONLY IF THERE ARE BLOCKED USERS */}

      {blockList.length > 0 && (
        <div style={{marginBottom: 15}}>
          <label>Currently blocked users</label>
          <ul className="list-group">
            {blockList.map((user) => {
              return <li className="list-group-item">{user}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="row">
        <form>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {setEmail(e?.target.value)}}
            />
            <small id="emailHelp" className="form-text text-muted">
              This address will be blocked from submitting
            </small>
          </div>

          <button
            className="btn btn-primary"
            onClick={addToBlocklist}
            style={{ marginTop: "15px" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
