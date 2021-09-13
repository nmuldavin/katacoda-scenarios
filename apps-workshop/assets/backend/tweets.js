const fetch = require("node-fetch");

// Stored as {"text": "hello world", "author": "Aristotle"}
let tweets = [];

async function getTweets() {
  if (!tweets.length) {
    let response = await fetch("https://type.fit/api/quotes");
    tweets = await response.json();
    // some quotes don't have authors
    tweets = tweets.filter((t) => t.author);
  }
  return tweets.slice(0, 15);
}

function postTweet(tweet) {
  if (!tweet.author) {
    console.log("Tweet missing author");
    return;
  }
  if (!tweet.text) {
    console.log("Tweet missing text");
    return;
  }
  tweets.unshift(tweet);
}

module.exports = {
  getTweets,
  postTweet,
};
