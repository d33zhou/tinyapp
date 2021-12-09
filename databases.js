// databases for express_server, simulated locally

// all shortURLs
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aaBB12",
    visits: 1,
    created: "Thu, 09 Dec 2021 22:00:00 GMT",
  },
  "9sm5xK": {
    longURL: "http://www.google.ca",
    userID: "aaBB12",
    visits: 3,
    created: "Thu, 09 Dec 2021 16:00:00 GMT",
  },
  "pP0a9W": {
    longURL: "http://www.youtube.com",
    userID: "aaBB12",
    visits: 1,
    created: "Wed, 08 Dec 2021 15:00:00 GMT",
  },
  "nZxx6A": {
    longURL: "http://www.amazon.ca",
    userID: "CCdd34",
    visits: 2,
    created: "Wed, 08 Dec 2021 15:00:00 GMT",
  },
  "267Ad1": {
    longURL: "http://www.google.ca",
    userID: "CCdd34",
    visits: 0,
    created: "Wed, 08 Dec 2021 13:00:00 GMT",
  },
};

// all users and user details
const users = {
  aaBB12: {
    id: "aaBB12",
    email: "user@example.com",
    password: "$2a$10$az8pGYtjheTDV4dmBY3XFuE4MRj5P3TdxSe7C7QUFYF.LCk2ZNZta" // test
  },
  CCdd34: {
    id: "CCdd34",
    email: "test@example.com",
    password: "$2a$10$sxbZ4ZNB5iyX1eYExmVmZOstSu2sPmSDhaINQ/OhBxQR9H8OKdh7a" // test
  },
};

module.exports = {
  urlDatabase,
  users
}