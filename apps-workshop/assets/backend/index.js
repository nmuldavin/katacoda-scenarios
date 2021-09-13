const {
  startMetricSubmission,
  addToBlocklist,
  setRateLimit,
  getBlockList,
  getRateLimit,
} = require("./telemetry.js");
const { createDashboard } = require("./dashboard.js");
const { createAppEntry } = require("./app-entry.js");
const { getTweets, postTweet } = require("./tweets.js");
const { v1 } = require("@datadog/datadog-api-client");

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// FEATURE 1
// BLOCKLIST ACTIONS
app.get("/blocklist", (req, res) => {
  res.json({
    users: getBlockList(),
  });
});

app.post("/blocklist", (req, res) => {
  const email = req.body.email;
  if (!email) {
    return;
  }

  addToBlocklist(email);
  res.send("");
});

// FEATURE 2
// RATE LIMITS
app.get("/limits", (req, res) => {
  res.json({
    limit: getRateLimit(),
  });
});

app.post("/limits", (req, res) => {
  let value = req.body.value;
  if (isNaN(value)) {
    return res.send("Need a value");
  }

  setRateLimit(value);
  res.send("");
});

// STATUS STREAM
app.get("/tweets", async (req, res) => {
  const tweets = await getTweets();

  res.json({
    tweets,
  });
});

app.post("/tweets", (req, res) => {
  let data = req.body;
  postTweet({
    author: data.author,
    text: data.text,
  });

  res.json({
    success: true,
  });
});

app.use(express.static("demo-ui/build"));

async function init() {
  // SETUP ROUTINES
  const configuration = v1.createConfiguration();
  const appID = await createAppEntry(configuration);
  await createDashboard(configuration, appID);
  startMetricSubmission(configuration);
  // START LISTENING
  app.listen(port, () => {
    console.log(
      `Initialized successfully. Listening at http://localhost:${port}`
    );
  });
}

init();
