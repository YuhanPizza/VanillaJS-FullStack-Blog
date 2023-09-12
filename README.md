# Welcome to VanillaJS-FullStack-Blog! 🎉

## Live Demo 🌍

Check out the live demo [here](https://fine-tan-goldfish-boot.cyclic.app).

## What's this all about? 🤔

Hey there, glad you stopped by! This isn't your run-of-the-mill, framework-heavy project. Nope, we're going back to basics with good old Vanilla JavaScript. If you're tired of all the `npm install` commands and just want to build something fun and essential, you're in the right place.

## Contents 📚

- [Let's Get Started!](#lets-get-started)
- [How to Install](#how-to-install)
- [Technologies](#technologies)
- [What's Inside?](#whats-inside)
- [Server.js Explained](#serverjs-explained)
- [How to Use](#how-to-use)
- [Routes](#routes)
- [Wanna Contribute?](#wanna-contribute)
- [Licenses & Stuff](#licenses--stuff)

## Let's Get Started! 🚀

Wanna take this for a spin? Cool, follow these steps to get the app running on your machine. It's super simple, promise.

## How to Install 🛠️

1. **Clone it**: `git clone https://github.com/YourUsername/VanillaJS-FullStack-Blog.git`
2. **Navigate into the project**: `cd VanillaJS-FullStack-Blog`
3. **Install all the things**: `npm install`
4. **Fire it up**: `npm start`

## Technologies 🛠️

- Node.js
- Express
- Handlebars
- MongoDB
- PostgreSQL
- Multer
- Cloudinary

## What's Inside? 📦

### `blog-service.js`

This is where the magic happens for our posts. It sets up our PostgreSQL database with Sequelize and does all the heavy lifting. Think of it as your blogging Swiss army knife.

### `auth-service.js`

Need to keep your users in check? This is your go-to file. It's hooked up to MongoDB and even takes care of password encryption. Yup, we've thought of everything.

## Server.js Explained 📖

### Required Libraries and Configuration

The `server.js` file requires several npm packages for functionality:

- `express`: Framework for Node.js.
- `express-handlebars`: Template engine for express.
- `client-sessions`: For managing user sessions.
- `cloudinary`: For image upload to Cloudinary service.
- `multer`: For handling multipart/form-data.

### Middlewares 🛡️

- `clientSessions`: Sets up session management.
- `express.urlencoded` and `express.static`: For parsing request body and serving static files.

### Custom Middlewares 🎩

- `ensureLogin`: Checks if the user is logged in.

### Helper Functions 🔧

- `safeHTML`: Strips JavaScript from a string to prevent XSS attacks.

### Routes 🗺️

Various routes for user interface and API functionality:

- `/login` and `/register` for user login and registration.
- `/posts/add` for blog post creation.
- `/posts` and `/categories` for listing all posts and categories.
## Handlebars Templates 🎨

### `main.hbs`

This is the main layout template that contains common elements like headers and footers.

### `404.hbs`

Displayed when a page is not found.

### `about.hbs`

About the blog and its author.

### `addCategory.hbs`

Form to add a new category.

### `addPost.hbs`

Form to add a new blog post.

### `blog.hbs`

Main page displaying the blog posts.

### `categories.hbs`

Lists all categories.

### `login.hbs`

User login form.

### `posts.hbs`

Lists all posts, typically with options to edit or delete.

### `register.hbs`

User registration form.

### `userHistory.hbs`

Displays the history of user activities.

## How to Use 🛠️

### Blog Posts 📝

- **`initialize()`**: Call this first to set up your database.
- **`getAllPosts()`**: Want to see all the posts? Run this.
- **`getPublishedPosts()`**: Only interested in published posts? No problem.

### User Management 👤

- **`initialize()`**: Run this first to get your user database up and running.
- **`registerUser()`**: New user? No problem, this function's got you covered.
- **`checkUser()`**: Quick and dirty user check for authentication.

## Routes 🗺️

### User Authentication 🔒

- `/login` - Displays login form.
- `/register` - Displays registration form.

### Posts 📝

- `/posts/add` - Form to add a new post.
- `/posts` - Lists all posts.

### Categories 🏷️

- `/categories/add` - Form to add a new category.
- `/categories` - Lists all categories.
