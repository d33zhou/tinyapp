const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const generatedString = generateRandomString();

  urlDatabase[generatedString] = req.body.longURL;
  res.send(`URL: ${req.body.longURL}\n
  Random string: ${generatedString}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString(letters = 6) {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomized = '';

  for (let i = 0; i < letters; i++) {
    randomized += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  return randomized;
};