const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const multer = require('multer');
const fs = require('fs');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.address, req.body.chatData, req.body.orders);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getUser(req.params.email);
  if (user) {
    res.send({user});
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// GetShopCards
apiRouter.get('/getShopCards', async (req, res) => {
  const cards = await DB.getShopCards();
  res.send(cards);
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


// Create ShopCard
secureApiRouter.post('/createShopCard', async (req, res) => {
  const card = req.body;
  if (card) {
    await DB.addShopCard(card);
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Validate the user's token
secureApiRouter.get('/validate', (_req, res) => {
  res.status(204).end();
});

// Return user data
secureApiRouter.get('/secureUser', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  const { password, token, ...userWithoutSensitiveInfo } = user;
  res.send(userWithoutSensitiveInfo);
});

// Update user order data
secureApiRouter.post('/updateUserOrders', async (req, res) => {
  const user = req.body;
  if (user) {
    await DB.updateUser(user);
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Update user chat data
secureApiRouter.post('/updateUserChat', async (req, res) => {
  const user = req.body;
  if (user) {
    await DB.updateUser(user);
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//Admin access to all users
secureApiRouter.get('/adminAccess', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user.isAdmin) {
    const users = await DB.getUsers();
    res.send(users);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Delete user account
secureApiRouter.post('/deleteUser', async (req, res) => {
  const userEmail = req.body;
  if (userEmail) {
    await DB.deleteUser(userEmail);
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Delete shop card
secureApiRouter.post('/deleteShopCard', async (req, res) => {
  const card = req.body;
  if (card) {
    let cardData = await DB.getShopCard(card);
    if (cardData) {
      if (cardData.picture) {
        fs.unlink(`public/${cardData.picture}`, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    }
    await DB.removeShopCard(card);

    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}


///
/// Upload shop pictures
/// 
const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/pics/creations/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 600 * 1024 }, // 600 KB
});

secureApiRouter.post('/upload', upload.single('picture'), (req, res, next) => {
  if (req.file) {
    res.send({
      message: 'Uploaded succeeded',
      file: req.file.filename,
    });
  } else {
    res.status(400).send({ message: 'Upload failed' });
  }
}, (err, req, res, next) => {
  // This is the error-handling function
  console.error('Error during file upload:', err);
  res.status(500).send({ message: 'Internal Server Error' });
});


// Websocket server
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);