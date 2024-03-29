/*********************************************************************************

* WEB322 – Assignment 06

* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part

* of this assignment has been copied manually or electronically from any other source

* (including 3rd party web sites) or distributed to other students.

*

* Name: Lorenz Alvin Tubo Student ID: 1090934224 Date: 07/29/2023

*

* Cyclic Web App URL: https://easy-teal-elk-gear.cyclic.app/about

*

* GitHub Repository URL: https://github.com/YuhanPizza/web322-app

*

********************************************************************************/
//mongoose
const mongoose = require("mongoose");
//bcryptjs
const bcrypt = require('bcryptjs');

//user schema.
const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

//user
let User;
//initalize
const initialize = () => {
  return new Promise(function (resolve, reject) {
    const connectionString =
    process.env.MONGODB_STRING;
    let db = mongoose.createConnection(connectionString);

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};
// register user
const registerUser = (userData) => {
    return new Promise(function (resolve, reject) {
      if (userData.password !== userData.password2) {
        reject("Passwords do not match");
      } else {
        bcrypt.hash(userData.password, 10)
          .then((hash) => {
            userData.password = hash;
            const newUser = new User(userData);
            return newUser.save(); // Return the promise
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            if (err.code === 11000) {
              reject("User Name already taken");
            } else {
              reject("There was an error creating the user: " + err);
            }
          });
      }
    });
  };
// check user
const checkUser = (userData) => {
    return new Promise(function (resolve, reject) {
      User.findOne({ userName: userData.userName })
        .then((user) => {
          if (!user) {
            reject("Unable to find user: " + userData.userName);
          } else {
            bcrypt.compare(userData.password, user.password)
              .then((result) => {
                if (result) {
                  const loginInfo = {
                    dateTime: new Date().toString(),
                    userAgent: userData.userAgent,
                  };
                  user.loginHistory.push(loginInfo);
                   // Keep only the last 10 logins.
                  if (user.loginHistory.length > 10) {
                    user.loginHistory = user.loginHistory.slice(-10);
                  }
                  return user.save(); // Return the promise
                } else {
                  reject("Incorrect Password for user: " + userData.userName);
                }
              })
              .then(() => {
                resolve(user);
              })
              .catch((err) => {
                reject("There was an error verifying the user: " + err);
              });
          }
        })
        .catch((err) => {
          reject("Unable to find user: " + userData.userName);
        });
    });
  };
module.exports = {
  userSchema,
  User,
  initialize,
  registerUser,
  checkUser,
};
