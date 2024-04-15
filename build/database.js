const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('kayliescreations');
const userCollection = db.collection('users');
const shopcardCollection = db.collection('shopCards');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});


//if users collection is empty, add kaylie and me
(async function addAdminUsers() {
    const adminPasswords = require('./adminPasswords.json');
    const findKaylie = await getUser(adminPasswords.kaylieEmail);
    
    if (!findKaylie) {
        const passwordHash = await bcrypt.hash(adminPasswords.kaylie, 10);
        const kaylie = {
            firstName: 'Kaylie',
            lastName: 'Jackson',
            email: 'kayliescreations30@gmail.com',
            password: passwordHash,
            isAdmin: true,
            ordersShipped: 0,
            token: uuid.v4()
        }
        await client.db('kayliescreations').collection('users').insertOne(kaylie);
        console.log(`Admin account created for kaylie`); 
    } else {
        console.log(`Admin access in place for kaylie`);
    }
  
  })().catch((ex) => {
    console.log(`Unable to add users because ${ex.message}`);
  });
  


function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password, firstName, lastName, address, chatData, orders) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    firstName: firstName,
    lastName: lastName,
    address: address,
    chatData: chatData,
    orders: orders

  };
  await userCollection.insertOne(user);
  return user;
}

function deleteUser(userToBeDeleted) {
    return userCollection.deleteOne({ email: userToBeDeleted.email });
}

function updateUser(updatedUserData) {
    return userCollection.updateOne({ email: updatedUserData.email }, { $set: { "chatData": updatedUserData.chatData, "orders": updatedUserData.orders } });
     
}

function addShopCard(newCard) {
    shopcardCollection.insertOne(newCard);
}

function removeShopCard(card) {
    shopcardCollection.deleteOne({ cardId: card.cardID });
}

function getShopCards() {
  const cards = shopcardCollection.find();
  return cards.toArray();
}

function getShopCard(card) {
    return shopcardCollection.findOne({ cardId: card.cardID });
}

function getUsers() {
  return userCollection.find({}, { password: 0, token: 0 }).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addShopCard,
  getShopCards,
  removeShopCard,
  deleteUser,
  updateUser,
  getUsers,
  getShopCard,
};
