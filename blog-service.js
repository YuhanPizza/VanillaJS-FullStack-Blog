/*********************************************************************************

* WEB322 – Assignment 03

* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part

* of this assignment has been copied manually or electronically from any other source

* (including 3rd party web sites) or distributed to other students.

*

* Name: Lorenz Alvin Tubo Student ID: 1090934224 Date: 06/13/2023

*

* Cyclic Web App URL: https://easy-teal-elk-gear.cyclic.app/about

*

* GitHub Repository URL: https://github.com/YuhanPizza/web322-app

*

********************************************************************************/
const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, 'data', 'posts.json'); //path for posts.json
const categoriesFilePath = path.join(__dirname, 'data', 'categories.json'); // categories.json

//variables used to store data.
let posts = []; 
let categories = []; 

const initialize = () => { //initalize is an arrow function 
  return new Promise((resolve, reject) => { //promise 
    fs.readFile(postsFilePath, 'utf8', (err, postData) => { //used to read the contents of the postFilePath 
      if (err) {//if there is an error
        reject('Unable to read posts file'); //reject message.
        return;
      }
      posts = JSON.parse(postData);// parsed as Json assigned to variable posts

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
//add posts
const addPost = (postData) => {
  return new Promise((resolve, reject) => {
    if (postData.published === undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }

    postData.id = posts.length + 1;

    posts.push(postData);

    resolve(postData);
  });
};
//get post by cat
const getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter((post) => post.category === parseInt(category));
    if (filteredPosts.length === 0) {
      reject('No category returned');
    } else {
      resolve(filteredPosts);
    }
  });
};
//getpost by date
const getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter((post) => new Date(post.postDate) >= new Date(minDateStr));
    if (filteredPosts.length === 0) {
      reject('No Date returned');
    } else {
      resolve(filteredPosts);
    }
  });
};
//getpost by id
const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const post = posts.find((post) => post.id.toString() === id);
    if (post) {
      resolve(post);
    } else {
      reject('No ID returned');
    }
  });
};
//when this module is imported into another file using require the imported object will have access to 
//these properties. server.js can call these functions.
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};