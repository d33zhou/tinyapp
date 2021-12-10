// Helper functions for express_server

// generate random 6-letter ids (user id and shortURL id)
const generateRandomString = (letters = 6) => {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomized = '';

  for (let i = 0; i < letters; i++) {
    randomized += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  return randomized;
};

// return user object based on given email parameter, or false if no match
const getUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return user;
    }
  }

  return;
};

// return object of all urls associated with given user ID
const urlsForUser = (id, urlDatabase) => {
  const filtered = {};
  let keys = Object.keys(urlDatabase).filter(url => urlDatabase[url].userID === id);

  for (const key of keys) {
    filtered[key] = urlDatabase[key];
  }

  return filtered;
};

// return unique number of visitors for a shortURL
const findUniqueVisits = (shortURL, urlDatabase) => {
  const idOccurrences = {};

  for (const visit of urlDatabase[shortURL].visitLog) {
    idOccurrences[visit.id] ? idOccurrences[visit.id]++ : idOccurrences[visit.id] = 1;
  }

  return Object.keys(idOccurrences).length;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  findUniqueVisits
};