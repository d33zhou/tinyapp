// EXPRESS ------------------------------------------

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

// MIDDLEWARE ---------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ['key1', 'key2']
}));

const bcrypt = require('bcryptjs');

// LOCAL DATABASE -----------------------------------

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aaBB12"
  },
  "9sm5xK": {
    longURL: "http://www.google.ca",
    userID: "aaBB12"
  },
};

//curl -X POST -i localhost:8080/urls/9sm5xK/delete

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

// --------------------------------------------------
// GET METHODS --------------------------------------
// --------------------------------------------------

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
  const userID = req.session.user_id;

  const templateVars = {
    user: users[userID],
    urls: urlsForUser(userID)
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // if not logged in, redirect to /login
  if (!users[req.session.user_id]) {
    res.redirect("/login");
    return;
  }
  
  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const filteredURLs = Object.keys(urlsForUser(userID));

  if (!Object.keys(urlDatabase).includes(shortURL)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Page Not Found"
    };

    return res.status(404).render("error", templateError);

  } else if (!filteredURLs.includes(shortURL)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Access Denied"
    };

    return res.status(400).render("error", templateError);
  }
  
  const templateVars = {
    user: users[userID],
    shortURL,
    longURL: urlDatabase[shortURL].longURL
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (!Object.keys(urlDatabase).includes(req.params.shortURL)) {
    res.redirect("/*");
    return;
  }
  
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  // if logged in, redirect to /urls
  if (users[req.session.user_id]) {
    res.redirect("/urls");
    return;
  }
  
  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render("user_login", templateVars);
});

app.get("/register", (req, res) => {
  // if logged in, redirect to /urls
  if (users[req.session.user_id]) {
    res.redirect("/urls");
    return;
  }
  
  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render("user_register", templateVars);
});

app.get("/*", (req, res) => {
  const templateError = {
    user: users[req.session.user_id],
    message: "ERROR: Page Not Found"
  };

  res.status(404).render("error", templateError);
});

// --------------------------------------------------
// POST METHODS -------------------------------------
// --------------------------------------------------

app.post("/login", (req, res) => {
  const loginAttempt = getUser(req.body.email, users);
  
  // redirect error if user does not exist or password does not match the hashed password
  if (!loginAttempt || !bcrypt.compareSync(req.body.password, loginAttempt.password)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Invalid Email or Password"
    };

    return res.status(403).render("error", templateError);
  }  
  
  req.session.user_id = loginAttempt.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  // data validation for email & password
  if (!req.body.email || !req.body.password) {
    const templateError = {
      user: undefined,
      message: "ERROR: Invalid Email or Password"
    };

    return res.status(400).render("error", templateError);
  }
  
  // prevent duplicate emails
  if (getUser(req.body.email, users)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Email Already Exists"
    };

    return res.status(400).render("error", templateError);
  }

  // create unique user and add to user database with hashed password
  const generatedString = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  users[generatedString] = {
    id: generatedString,
    email: req.body.email,
    password: hashedPassword
  };

  req.session.user_id = generatedString;

  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    const templateError = {
      user: undefined,
      message: "ERROR: Access Denied"
    };

    return res.status(403).render("error", templateError);
  }
  
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    const templateError = {
      user: undefined,
      message: "ERROR: Access Denied"
    };

    return res.status(403).render("error", templateError);
  }
  
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post("/urls", (req, res) => {
  // if not logged in, output error
  if (!users[req.session.user_id]) {
    const templateError = {
      user: undefined,
      message: "ERROR: User Not Logged In"
    };

    return res.status(400).render("error", templateError);
  }
  
  const generatedString = generateRandomString();

  urlDatabase[generatedString] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${generatedString}`);
});

// --------------------------------------------------
// SERVER -------------------------------------------
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// --------------------------------------------------
// FUNCTIONS ----------------------------------------
// --------------------------------------------------

const generateRandomString = (letters = 6) => {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomized = '';

  for (let i = 0; i < letters; i++) {
    randomized += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  return randomized;
};

const getUser = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }

  return false;
};

const urlsForUser = id => {
  const filtered = {};
  let keys = Object.keys(urlDatabase).filter(url => urlDatabase[url].userID === id);

  for (const key of keys) {
    filtered[key] = urlDatabase[key];
  }

  return filtered;
};