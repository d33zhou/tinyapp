// databases for express_server, simulated locally

// all shortURLs
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aaBB12",
    created: new Date(1639089769977),
    visitLog: [
      {id: "16Stv8", time: new Date(1639089969977)}
    ],
  },
  "9sm5xK": {
    longURL: "http://www.google.ca",
    userID: "aaBB12",
    created: new Date(1639089769977),
    visitLog: [
      {id: "16Stv8", time: new Date(1639089770000)},
      {id: "16Stv8", time: new Date(1639089999977)},
      {id: "yYts72", time: new Date(1639090000000)}
    ],
  },
  "pP0a9W": {
    longURL: "http://www.youtube.com",
    userID: "aaBB12",
    created: new Date(1639000000000),
    visitLog: [
      {id: "16Stv8", time: new Date(1639000400000)}
    ],
  },
  "nZxx6A": {
    longURL: "http://www.amazon.ca",
    userID: "CCdd34",
    created: new Date(1639089769977),
    visitLog: [
      {id: "16Stv8", time: new Date(1639089969977)},
      {id: "yYts72", time: new Date(1639090003300)}
    ],
  },
  "267Ad1": {
    longURL: "http://www.google.ca",
    userID: "CCdd34",
    created: new Date(1639000000000),
    visitLog: [],
  },
};

// all users and user details
const users = {
  aaBB12: {
    id: "aaBB12",
    email: "user@example.com",
    password: "$2a$10$az8pGYtjheTDV4dmBY3XFuE4MRj5P3TdxSe7C7QUFYF.LCk2ZNZta", // pw: test
  },
  CCdd34: {
    id: "CCdd34",
    email: "test@example.com",
    password: "$2a$10$sxbZ4ZNB5iyX1eYExmVmZOstSu2sPmSDhaINQ/OhBxQR9H8OKdh7a", // pw: test
  },
};

module.exports = {
  urlDatabase,
  users
}