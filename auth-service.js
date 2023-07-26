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
      "mongodb+srv://dbUser:0000@senecaweb.swxrpp4.mongodb.net/?retryWrites=true&w=majority";
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
