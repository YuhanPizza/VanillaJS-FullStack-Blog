/*********************************************************************************

* WEB322 – Assignment 02

* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part

* of this assignment has been copied manually or electronically from any other source

* (including 3rd party web sites) or distributed to other students.

*

* Name: Lorenz Alvin Tubo Student ID: 1090934224 Date: 06/01/2023

*

* Cyclic Web App URL: ________________________________________________________

*

* GitHub Repository URL: https://github.com/YuhanPizza/web322-app

*

********************************************************************************/
const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, 'data', 'posts.json');
const categoriesFilePath = path.join(__dirname, 'data', 'categories.json');

//variables used to store data.
let posts = []; 
let categories = []; 

const initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(postsFilePath, 'utf8', (err, postData) => {
      if (err) {
        reject('Unable to read posts file');
        return;
      }
      posts = JSON.parse(postData);

      fs.readFile(categoriesFilePath, 'utf8', (err, categoriesData) => {
        if (err) {
          reject('Unable to read categories file');
          return;
        }
        categories = JSON.parse(categoriesData);
        resolve();
      });
    });
  });
};
//get all posts.
const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) { //if posts is empty
      reject('No posts available'); //reply for fail
    } else {
      resolve(posts); //success 
    }
  });
};
// filter through published post = true
const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published === true); // stores the publish == true to the published post.
    if (publishedPosts.length === 0) { //if there is nothing inside of the published post.
      reject('No published posts available'); //reply for fail.
    } else {
      resolve(publishedPosts); //reply for success.
    }
  });
};
//categories
const getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) { //checks if categories are empty
      reject('No categories available'); //fail
    } else {
      resolve(categories); //success
    }
  });
};

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
};