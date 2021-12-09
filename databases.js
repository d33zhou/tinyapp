// databases for express_server, simulated locally

// all shortURLs
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aaBB12",
    visits: 7
  },
  "9sm5xK": {
    longURL: "http://www.google.ca",
    userID: "aaBB12",
    visits: 32
  },
  "e7HeP0": {
    longURL: "http://www.outlook.com",
    userID: "aaBB12",
    visits: 3
  },
  "ySC21a": {
    longURL: "http://www.reddit.com",
    userID: "aaBB12",
    visits: 67
  },
  "pP0a9W": {
    longURL: "http://www.youtube.com",
    userID: "aaBB12",
    visits: 23
  },
  "nZxx6A": {
    longURL: "http://www.amazon.ca",
    userID: "CCdd34",
    visits: 14
  },
  "267Ad1": {
    longURL: "http://www.google.ca",
    userID: "CCdd34",
    visits: 8
  },
};

// all users and user details
const users = {
  aaBB12: {
    id: "aaBB12",
    email: "user@example.com",
    password: "test1"
  },
  CCdd34: {
    id: "CCdd34",
    email: "test@example.com",
    password: "test2"
  },
};

module.exports = {
  urlDatabase,
  users
}