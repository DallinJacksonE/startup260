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

// GetScores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// Authenticate a login attempt
apiRouter.post('/authenticate', (req, res) => {
  let user = authenticateUser(req.body);
  res.send(user);
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