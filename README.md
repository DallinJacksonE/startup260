# startup260

Deliverable and notes for CS260 at BYU

## Pitch

My sister has built up a small business over the last few years, and I'd like to make her a website where she can show her products, upcoming fairs, and for paying users, sell video tutorials for her work.
There is a lot to set up and learn, but I am hopeful that I can make her something that she can use to generate more income and online presence.

## Key Features

This website will be primarily a communication tool for my sister. It will include the ability for customers to login, and see a splash screen with current information that Kaylie will be able to uodate. There will be a gallery of available products for purchase. A login will be required to enter the chat, where one can place orders and give specifications about how they want their products. In the chat, users will talk with Kaylie, and once an agreement is made, they will pay Kaylie's venmo account. The website will then make a ticket that Kaylie will be able to see on an orders page only available to users with the admin status. She can mark them complete, then send the user a message that their product is on the way.

## Technologies

1. **Authentication** will be used by customers that wish to purchase an item. It will be used so that users can have private chats with Kaylie, exchange a shipping address, and pay.
2. **Database data** will store users and their information, a list of Kaylie's inventory, her active status, and orders that she has accepted and their completion status.
3. **WebSocket data** will be used for chats, orders created by the user, and users who want to be emailed when Kaylie's status is active again.
4. **HTML, CSS** will be used to build the website and style it. Kaylie currently wants to be a UI/UX designer, so it will be fun to do that together.
5. **Javavscript** will power the order buttons for the users, it will fill out an order ticket for them that they can review and send to Kaylie.
6. **Web Service** include providing a link and mini gallery to Kaylie's Creations Instagram account
7. **Web Framework** will be rewritten with React to add more components and functionality.

## Concept Images

### Main Page

![Screenshot of a mainpage](https://github.com/DallinJacksonE/startup260/blob/main/docs/picsForConcept/homepage.jpg)

### Gallery

![Concept Drawing of the gallery](https://github.com/DallinJacksonE/startup260/blob/main/docs/picsForConcept/gallery.jpg)

### Inquiry Page

![Concept Drawing of the inquiry page, where conversations and orders are had](https://github.com/DallinJacksonE/startup260/blob/main/docs/picsForConcept/orderchat.jpg)

### Login Page

![Concept Drawing of the login page](https://github.com/DallinJacksonE/startup260/blob/main/docs/picsForConcept/login.jpg)

## Notes/Deliverables

### ✅ Setting up HTTPS with caddy

After buying the domain name kayliescreations.biz, I updated the caddy file to reroute from port 80 to the service page. I ran the apt -get--update command so my caddy was broken, but since then have gotten things working right.

### ✅ HTML Deliverable

I used HTMl to create the following:

- [x] 6 html pages with different layouts based on the technologies that would be included.
- [x] Various text paragraphs within the ```<main></main>``` html tag in the body of each page
- [x] A login form for customer information and orders to be stored in the DB
- [x] A websocket will be used to implement a chat between the main user (my sister Kaylie) and all the other users
- [x] Images will be shown in the store page, I am still working on getting the item tabs to line up before putting images in, but until then, I have an image on the main page as a placeholder for an embedded instagram gallery.

### ✅ CSS deliverable

CSS implemented the following:

- [x] fonts, and text sizes for headers and words. My sister picken out Goblin One and Newsreader from Google.fonts, so I have an API call importing those fonts at the top of my css file
- [x] Bootsrap was imported as well, I am working on using their available CSS classes to increase the professionalism and responsiveness of my site.
- [x] Container placement and padding was set up
- [x] Login will be made pretty
- [x] Navbar functionality and responsiveness
- [x] Image placement and gallery design

### ✅ Javascript deliverable

- [x] A login that will validate credentials from a JSON file, then store the user data locally for other webpages to access (for security need to update so password isn't saved locally)
- [x] A chat window that will let kaylie toggle between all registered users and the chat data she has with them (websocket)
- [x] A form to add shop cards (mock database)
- [x] A form to delete shop cards (mock database)
- [x] A responsive navbar that gives visitors a limited access to functions like chat and ordering, and logged in users full customer functionaliry, and admin users access to the admin page (responsive to local data)
- [x] a chat with Kaylie available to all logged in users (websocket)
- [x] an order cart where people can submit an order and see submitted orders (mock database)

### ✅ Service Deliverable

- [x] Convert startup to a webservice
- [x] Write middleware for website functionality
- [x] Make the login and new account functions work with the service
- [x] Make the add shop card and delete shop card functionality work with service
- [x] Have the chat data be updated as users write to the chat
- [x] Have the frontend call the instagram API to get Kaylie's instagram gallery
- [x] Have the orders work

### ‼️ Note for TAs

I have a test account for you guys you can use, or you can make an account to test out the admin features of adding from the shop to the orders cart and chatting.
email: <csTA@fake.edu>
password: Apollo

### ✅ Login Deliverable

- [x] User can make and delete a personal account
- [x] Admin can see all user information
- [x] On login, the user is given a unique cookie ID to be able to access:
      - the navbar with shopping functionality
      - an account page to see orders and order status
      - the shop, not the gallery
      - a chat with Kaylie
- [x] Admin capacity includes
      - creating new shop cards
      - deleting shop cards
      - uploading picture files to the server
      - seeing all user orders
      - update the status of user orders
      - a chat with each user
- [x] index.js is modularized into a index.js and database.js
- [x] all data is stored in mongoDB (excet for shopcard photos)
- [x] apis rewritten to use more secure practices

## ✅ WebSocket Deliverable

- [x] Websocket file is written and an HTTP request is upgraded to a websocket connection
- [x] Websocket sends and recives work as expected
- [x] User gets real time update in chat window
- [x] Admin get real time update, and refreshes the active tab if message is recieved
- [x] Scroll to bottom of chat function

### TO DO

- [x] Have error messages display when the login is incorrect
- [ ] Have a feedback response for when something is added to the cart from the shop
- [x] kaylie needs a table of placed orders
- [x] user page with submitted orders, ability to delete orders, change address, or delete account
- [ ] Square pay integration
- [x] shop card picture file submission
