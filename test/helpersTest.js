const { assert } = require('chai');
const { getUserByEmail, generateRandomString } = require('../server_support/helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('#getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined for a non-valid email', () => {
    const user = getUserByEmail("notARealEmail@notReal.Com", testUsers)
    assert.isUndefined(user);
  });
});

describe('#generateRandomString', () => {
  it('should generate a 6-letter string when called', () => {
    const generated = generateRandomString();
    assert.equal(generated.length, 6);
  });
});