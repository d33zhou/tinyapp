// --------------------------------------------------
// HELPER FUNCTIONS AND DATABASES -------------------
// --------------------------------------------------

const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');
const { urlDatabase, users } = require('./databases');

// --------------------------------------------------
// EXPRESS & SERVER SET-UP --------------------------
// --------------------------------------------------

const express = require("express");
const app = express();
const PORT = 8080; // using 8080 as default

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// --------------------------------------------------
// MIDDLEWARE SET-UP --------------------------------
// --------------------------------------------------

// read HTTP body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// encrypt cookies
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ['key1', 'key2']
}));

// to hash passwords
const bcrypt = require('bcryptjs');

// override form POST to PUT/DELETE
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// --------------------------------------------------
// GET METHODS --------------------------------------
// --------------------------------------------------

// redirect to urls or login depending on login status
app.get("/", (req, res) => {
  // if not logged in, redirect to /login
  if (!users[req.session.user_id]) {
    res.redirect("/login");
    return;
  }

  res.redirect("/urls");
});

// for development
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// for development
app.get("/users.json", (req, res) => {
  res.json(users);
});

// main page - URLs index
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  const templateVars = {
    user: users[userID],
    urls: urlsForUser(userID, urlDatabase)
  };

  res.render("urls_index", templateVars);
});

// create new URL page
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

// view specific URL page
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const filteredURLs = Object.keys(urlsForUser(userID, urlDatabase));

  // check if shortURL is valid
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Page Not Found"
    };

    return res.status(404).render("error", templateError);

    // check if user has access rights to view the page
  } else if (!filteredURLs.includes(shortURL)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Access Denied"
    };

    return res.status(400).render("error", templateError);
  }

  const templateVars = {
    shortURL,
    user: users[userID],
    longURL: urlDatabase[shortURL].longURL,
    created: urlDatabase[shortURL].created.toUTCString(),
    visitLog: urlDatabase[shortURL].visitLog,
    unique: urlDatabase[shortURL].unique,
  };

  res.render("urls_show", templateVars);
});

// redirect to the long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  
  // redirect 404 if shortURL doesn't exist
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    res.redirect("/*");
    return;
  }
  
  // generate random ID for anonymous users
  let id = req.session.visitor_id ? req.session.visitor_id : generateRandomString();
  // check if the visitor_id is already present in the visit log
  const alreadyVisited = urlDatabase[shortURL].visitLog
    .map(visit => visit.id)
    .includes(id);
  !alreadyVisited ? urlDatabase[shortURL].unique++ : "";

  // add the visit to the visit log
  urlDatabase[shortURL].visitLog.push({
    id,
    time: new Date(),
  });

  // redirect to the longURL
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// login page
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

// register page
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

// 404 page
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

// login and authentication
app.post("/login", (req, res) => {
  const loginAttempt = users[getUserByEmail(req.body.email, users)];
  
  // redirect error if user does not exist or password does not match the hashed password
  if (!loginAttempt || !bcrypt.compareSync(req.body.password, loginAttempt.password)) {
    const templateError = {
      user: undefined,
      message: "ERROR: Invalid Email or Password"
    };

    return res.status(403).render("error", templateError);
  }
  
  // assign cookie credentials
  req.session.user_id = loginAttempt.id;
  req.session.visitor_id = generateRandomString();

  res.redirect("/urls");
});

// logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// create a new user
app.post("/register", (req, res) => {
  // data validation for email & password
  if (!req.body.email || !req.body.password) {
    const templateError = {
      user: undefined,
      message: "ERROR: Invalid Email or Password"
    };

    return res.status(400).render("error", templateError);
  }
  
  // prevent duplicate emails in database
  if (getUserByEmail(req.body.email, users)) {
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
    password: hashedPassword,
  };

  // assign cookie credentials
  req.session.user_id = generatedString;
  req.session.visitor_id = generateRandomString();

  res.redirect("/urls");
});

// edit a shortURL
app.put("/urls/:shortURL", (req, res) => {
  // check if user has access rights to edit the shortURL
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    const templateError = {
      user: undefined,
      message: "ERROR: Access Denied"
    };

    return res.status(403).render("error", templateError);
  }
  
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect("/urls");
});

// delete a shortURL
app.delete("/urls/:shortURL", (req, res) => {
  // check if user has access rights to delete the shortURL
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

// create new shortURL
app.post("/urls", (req, res) => {
  // if not logged in, output error
  if (!users[req.session.user_id]) {
    const templateError = {
      user: undefined,
      message: "ERROR: User Not Logged In"
    };

    return res.status(400).render("error", templateError);
  }
  
  // create new short URL data and add to database
  const generatedString = generateRandomString();

  urlDatabase[generatedString] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
    created: new Date(),
    visitLog: [],
    unique: 0
  };
  res.redirect(`/urls/${generatedString}`);
});