const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

// MIDDLEWARE ---------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// LOCAL DATABASE -----------------------------------

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

// GET METHODS --------------------------------------

/* app.get("/", (req, res) => { //dev only, to delete
  res.send("Hello!");
}); */

app.get("/urls.json", (req, res) => { //dev only, to delete
  res.json(urlDatabase);
});

app.get("/users.json", (req, res) => { //dev only, to delete
  res.json(users);
});

/* app.get("/hello", (req, res) => { //dev only, to delete
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); */

// -----------------------------------------------

app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  res.render("user_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  res.render("user_login", templateVars);
});

// POST METHODS -------------------------------------

app.post("/login", (req, res) => {
  const loginAttempt = getUser(req.body.email);
  
  if (!loginAttempt || loginAttempt.password !== req.body.password) {
    res.status(403).send("Error - invalid email or password.");
    return;
  }  
  
  res.cookie("user_id", loginAttempt.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Error - invalid inputs.");
    return;
  }
  
  if (getUser(req.body.email)) {
    res.status(400).send("Error - user already exists.");
    return;
  }

  const generatedString = generateRandomString();

  users[generatedString] = {
    id: generatedString,
    email: req.body.email,
    password: req.body.password
  };

  res.clearCookie("user_id");
  res.cookie("user_id", generatedString);

  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/urls", (req, res) => {
  const generatedString = generateRandomString();

  urlDatabase[generatedString] = req.body.longURL;
  res.redirect(`/urls/${generatedString}`);
});

// SERVER -------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// FUNCTIONS ----------------------------------------

const generateRandomString = (letters = 6) => {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomized = '';

  for (let i = 0; i < letters; i++) {
    randomized += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  return randomized;
};

const getUser = email => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }

  return false;
};