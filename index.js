const express = require('express');
const fs = require('fs');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create a new user
apiRouter.post('/createAccount', (req, res) => {
  let successBool = addUser(req.body);
  res.send(successBool);
});

// Authenticate a login attempt
apiRouter.post('/authenticate', (req, res) => {
  let user = authenticateUser(req.body);
  res.send(user);
});

// Serve up the shop cards
apiRouter.get('/getShopCards', (_req, res) => {
  let shopCardData = updateShopCards();
  console.log('Shop Cards backend: ', shopCardData);
  res.send(shopCardData);
});

// Update the shop cards
apiRouter.post('/updateShopCards', (req, res) => {
  console.log('Request body: ', req.body);
  let shopCardData = updateShopCards(req.body);
  console.log('Shop Cards: ', shopCardData);
  res.send(shopCardData);
});

// Send the user data (without passwords) to the front-end
apiRouter.get('/safeUserData', (_req, res) => {
  let userData = safeUserData();
  res.send(userData);
});

apiRouter.post('/updateUserData', (req, res) => {
  let successBool = updateUserData(req.body);
  res.send(successBool);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// updateScores considers a new score for inclusion in the high scores.
// The high scores are saved in memory and disappear whenever the service is restarted.
function authenticateUser(loginInfo) {
  let valid = false;
  let user;
  let users = JSON.parse(fs.readFileSync('users.json'));
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === loginInfo.email && users[i].password === loginInfo.password) {
      valid = true;
      user = users[i];
      break;
    }
  }

  if (!valid) {
    user = {error: "Invalid email or password"};
  }
  return user;
}

function addUser(userInfo) {
  let valid = true;
  let user;
  let users = JSON.parse(fs.readFileSync('users.json'));
  // Check if the email is already in use
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === userInfo.email) {
      valid = false;
      break;
    }
  }
  if (valid) {
    users.push(userInfo);
    fs.writeFileSync('users.json', JSON.stringify(users));
    user = userInfo;
  }
  if (!valid) {
    user = {error: "This email already exists with a user account. Please log in or use a different email address."};
  }
  return user;
}

function updateShopCards(newCardData = null) {
  let shopCardData;
  if (newCardData) {
  //new data, write it to the file and return it
    shopCardData = JSON.parse(fs.readFileSync('shopCards.json'));
    shopCardData.push(newCardData);
    fs.writeFileSync('shopCards.json', JSON.stringify(newCardData));
  } else {  
  //no new data, just read and return the current data
  shopCardData = JSON.parse(fs.readFileSync('shopCards.json'));
  }
  return shopCardData;

}

function safeUserData() {
  let userData = JSON.parse(fs.readFileSync('users.json'));
  for (let i = 1; i < userData.length; i++) {
    delete userData[i].password;
  }
  return userData;
}

function updateUserData(updatedUserData) {
  
  let userData = JSON.parse(fs.readFileSync('users.json'));
  let successBool = false;

  for (let i = 0; i < userData.length; i++) {
    if (userData[i].email === updatedUserData.email) {
      updatedUserData.password = userData[i].password;
      userData[i] = updatedUserData;
      successBool = true;
      break;
    }
  }

  if (successBool) {
    fs.writeFileSync('users.json', JSON.stringify(userData));
  }
  return {success: successBool};
}