const { v1 } = require("@datadog/datadog-api-client");
const { USERS } = require("./users.js");

let submissionRoutine = null;
let globalRateLimit = 100;
let apiInstance = null;

const INTERVAL = 3000;
const submitPoints = () => {
  const now = new Date().getTime() / 1000;

  // Tweets posted
  apiInstance.submitMetrics({
    body: {
      series: USERS.map((user) => {
        // basically 5% chance of submitting a tweet
        let value = Math.random() < 0.05 ? 1 : 0;

        if (user.role === "post-spam") {
          value = 5;
        }

        // if the user is banned, drop their usage
        if (user.state === "blocked") {
          value = 0;
        }

        return {
          metric: "tweets.posted",
          points: [[now, value]],
          tags: [`user:${user.email}`],
          type: "count",
        };
      })
        // skip counts with 0 value
        .filter((submission) => submission.points[0][1] > 0),
    },
  });

  // API gets
  apiInstance.submitMetrics({
    body: {
      series: USERS.map((user) => {
        // normal rate is 1
        let value = 1;

        if (user.role === "get-spam") {
          value = 5;
        }

        // apply global rate limit
        value = Math.min(value, globalRateLimit);

        // add some randomness for illustrative purposes
        value = value + 0.1 * Math.random();

        return {
          interval: 3,
          metric: "tweets.api.gets",
          points: [[now, value]],
          tags: [`user:${user.email}`],
          type: "rate",
        };
      }),
    },
  });
};

exports.startMetricSubmission = (configuration) => {
  if (submissionRoutine) {
    return;
  }
  apiInstance = new v1.MetricsApi(configuration);
  submissionRoutine = setInterval(submitPoints, INTERVAL);
};

exports.addToBlocklist = (email) => {
  const user = users.find((u) => u.email === email);
  if (!user) {
    return;
  }
  user.state = "blocked";
};

exports.getBlockList = () => {
  return users.filter((u) => u.state === "blocked").map((u) => u.email);
};

exports.getRateLimit = () => {
  return globalRateLimit;
};

exports.setRateLimit = (value) => {
  console.log(`Setting rate limit to ${value}`);
  globalRateLimit = value;
};
