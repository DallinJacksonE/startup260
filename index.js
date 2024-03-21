const express = require('express');
const fs = require('fs');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


///
/// MongoDB 
///

//get keys
const config = require('./dbConfig.json');
const e = require('express');
//build url
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
//create client and db
const client = new MongoClient(url);
const db = client.db('kayliescreations');
//create collections
const shopCards = db.collection('shopCards');
const users = db.collection('users');

//check if connection can be established
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
  console.log('Connected to database');

})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

//clean up user entries if version update requires more values in their object
//get all users
(async function cleanUpExistingUsers() {
  const allUsers = users.find();
  const userArray = await allUsers.toArray();
  //loop through each user
  userArray.forEach(user => {
    //if user does not have a cart, add a cart
    if (!user.cart && user.isAdmin === false) {
      user.cart = [];
      //update user entry
      users.updateOne({email: user.email}, {$set: user});
      console.log(`Updated user ${user.email}`);
    }
  
    //
  })
})().catch((ex) => {
  console.log(`Unable to clean up users because ${ex.message}`);
});

//if users collection is empty, add kaylie and me
(async function addAdminUsers() {
  const adminPasswords = require('./adminPasswords.json');
  const allUsers = users.find();
  const userArray = await allUsers.toArray();
  if (userArray.length === 0) {
    const kaylie = {
      firstName: 'Kaylie',
      lastName: 'Jackson',
      email: 'kayliescreations30@gmail.com',
      password: adminPasswords.kaylie,
      isAdmin: true,
      ordersShipped: 0
    }
    const dallin = {
      firstName: 'Dallin',
      lastName: 'Jackson',
      email: 'dallin.e.jackson@gmail.com',
      password: adminPasswords.dallin,
      isAdmin: false,
      address: {
        addressLine1: '443 South State Street',
        addressLine2: 'APT 208',
        city: 'Provo',
        state: 'UT',
        zip: '84606'
      },
      orders : [],
      chatData : []
    }
    const result = await client.db('kayliescreations').collection('users').insertMany([kaylie, dallin]);
    console.log(`${result.insertedCount} new user(s) created with the following id(s):`);
    console.log(result.insertedIds); 
  }

})().catch((ex) => {
  console.log(`Unable to add users because ${ex.message}`);
});

//functions to insert/edit/delete

async function createDocument(collection, document) {
  const result = await collection.insertOne(document);
  console.log(`New document created with the following id: ${result.insertedId}`);
  return result;
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

apiRouter.post('/upload', upload.single('picture'), (req, res, next) => {
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

///
/// Endpoints
///


// Create a new user
apiRouter.post('/createAccount', async (req, res) => {
  let reply = await addUser(req.body);
  console.log('New account call result: ', reply);
  res.send(reply);
});

// Authenticate a login attempt
apiRouter.post('/authenticate', async (req, res) => {
  try {
    const loginRequest = await authenticateUser(req.body);
    console.log('Login request: ', loginRequest);
    res.send(loginRequest );
  } catch (error) {
    console.error('Error during authentication: ', error);
    res.send({ error: 'Failed to authenticate user' });
  }
});

// Serve up the shop cards
apiRouter.get('/getShopCards', async (_req, res) => {
  let shopCardData = await updateShopCards();
  console.log('Shop Cards for (getShopChards) call: ', shopCardData);
  res.send(shopCardData);
});

// Update the shop cards
apiRouter.post('/updateShopCards', async (req, res) => {
  console.log('Request body: ', req.body);
  let shopCardData = await updateShopCards(req.body);
  console.log('Shop Cards for (updateShopCards) call: ', shopCardData);
  res.send(shopCardData);
});

apiRouter.post('/deleteShopCard', async (req, res) => {
  console.log('Request body: ', req.body);
  let shopCardData = await deleteShopCard(req.body);
  console.log('Shop Cards for (deleteShopCard) call: ', shopCardData);
  res.send(shopCardData);
});

// Send the user data (without passwords) to the front-end
apiRouter.get('/safeUserData', async (_req, res) => {
  let userData = await safeUserData();
  res.send(userData);
});

// Update the user data
apiRouter.post('/updateUserData', async (req, res) => {

  console.log('Request body: ', req.body);
  let updateData = req.body;
  delete updateData._id;
  (await users.updateOne({email: updateData.email}, {$set: updateData}));
  
  res.send({success: true});
});

//Delete a user
apiRouter.post('/deleteUser', async (req, res) => {
  (await users.deleteOne({email: req.body.email}))
  console.log('Deleted user: ', req.body.email);
  res.send({success: true});
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


///
/// Functions for shop cards
///


async function updateShopCards(newCardData = null) {

  console.log('New card data: ', newCardData);
  
  if (newCardData) {
    //new data
    const result = await shopCards.insertOne(newCardData);
    console.log(`New shop card created with the following id: ${result.insertedId}`);
    return {success: true};

  } else {  
  //no new data, just read and return the current data
  let shopCardsFromDB = shopCards.find();
  let shopCardData = await shopCardsFromDB.toArray();
  return shopCardData;
  }

}

async function deleteShopCard(cardID) {
  // Get the card data from the database
  let cardData = await shopCards.findOne({cardId: cardID.cardID});
  console.log('Card data to be deleted: ', cardData);
  if (cardData && cardData.picture) {
    let picturePath = "public/" + cardData.picture;
    console.log('Picture path to be deleted: ', picturePath);
    //delete the picture
    fs.unlink(picturePath, (err) => {
      if (err) {
        console.error('Error deleting picture: ', err);
      } else {
        console.log('File Removed: ', picturePath);
      }
    });

    const result = await shopCards.deleteOne({cardId: cardID.cardID});
    console.log(`Deleted shop card with the following id: ${cardID.cardID}`);
  }

  return {success: true};
}


///
/// Functions for user data
///


async function authenticateUser(loginInfo) {
  let valid = false;
  let returnData;
  try {
    let response = users.find();
    let existingUsers = await response.toArray();
  
    for (let i = 0; i < existingUsers.length; i++) {
      if (existingUsers[i].email === loginInfo.email && existingUsers[i].password === loginInfo.password) {
        valid = true;
        returnData = JSON.stringify(existingUsers[i]);
        break;
      }
    }
  
    if (!valid) {
      returnData = {error: "Invalid email or password"};
    }
  
    console.log('Return data: ', returnData);

    return returnData;
  } catch (error) {
    console.error('Error during authentication: ', error);
    return {error: 'Failed to authenticate user'};
  }
  
}

async function addUser(newUserInfo) {
  let valid = true;
  let returnData;
  let response = users.find();
  let existingUsers = await response.toArray();

  // Check if the email is already in use
  for (let i = 0; i < existingUsers.length; i++) {
    if (existingUsers[i].email === newUserInfo.email) {
      valid = false;
      break;
    }
  }
  if (valid) {
    createDocument(users, newUserInfo);
    returnData = newUserInfo;
  }
  if (!valid) {
    returnData = {error: "This email already exists with a user account. Please log in or use a different email address."};
  }
  return returnData;
}

async function safeUserData() {
  let userData = users.find();
  let userDataArray = await userData.toArray();

  for (let i = 1; i < userDataArray.length; i++) {
    delete userDataArray[i].password;
  }
  return userDataArray;
}