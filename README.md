# Welcome to VanillaJS-FullStack-Blog! 🎉

## What's this all about? 🤔

Hey there, glad you stopped by! This isn't your run-of-the-mill, framework-heavy project. Nope, we're going back to basics with good old Vanilla JavaScript. If you're tired of all the `npm install` commands and just want to build something fun and essential, you're in the right place.

## Contents 📚

- [Let's Get Started!](#lets-get-started)
- [How to Install](#how-to-install)
- [What's Inside?](#whats-inside)
- [How to Use](#how-to-use)
- [Wanna Contribute?](#wanna-contribute)
- [Licenses & Stuff](#licenses--stuff)

## Let's Get Started! 🚀

Wanna take this for a spin? Cool, follow these steps to get the app running on your machine. It's super simple, promise.

## How to Install 🛠️

1. **Clone it**: `git clone https://github.com/YuhanPizza/VanillaJS-FullStack-Blog.git`
2. **Navigate into the project**: `cd VanillaJS-FullStack-Blog`
3. **Install all the things**: `npm install`
4. **Fire it up**: `npm start`

> **Note**: Don't forget to create an `.env` file to put in your secret stuff, like database credentials.

## What's Inside? 📦

Let's talk about some of the code gems in this project.

### `blog-service.js`

This is where the magic happens for our posts. It sets up our PostgreSQL database with Sequelize and does all the heavy lifting. Think of it as your blogging Swiss army knife.

### `auth-service.js`

Need to keep your users in check? This is your go-to file. It's hooked up to MongoDB and even takes care of password encryption. Yup, we've thought of everything.

## How to Use 🛠️

### Blog Posts 📝

- **`initialize()`**: Call this baby first to set up your database.
- **`getAllPosts()`**: Want to see all the posts? Run this.
- **`getPublishedPosts()`**: Only interested in published posts? No problem.

### User Management 👤

- **`initialize()`**: Run this first to get your user database up and running.
- **`registerUser()`**: New user? No problem, this function's got you covered.
- **`checkUser()`**: Quick and dirty user check for authentication.

## Wanna Contribute? 🤝

Got an awesome idea? Found a nasty bug? Open an issue or shoot us a pull request. All contributions are more than welcome!

## Licenses & Stuff 📝

All this is under MIT License, so feel free to use it and build upon it.

So what are you waiting for? Happy coding! 🚀
