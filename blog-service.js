const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, 'data', 'posts.json');
const categoriesFilePath = path.join(__dirname, 'data', 'categories.json');

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

const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject('No posts available');
    } else {
      resolve(posts);
    }
  });
};

const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published === true);
    if (publishedPosts.length === 0) {
      reject('No published posts available');
    } else {
      resolve(publishedPosts);
    }
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No categories available');
    } else {
      resolve(categories);
    }
  });
};

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
};