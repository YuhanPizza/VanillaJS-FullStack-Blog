//require blog-service
const blogService = require('./blog-service');
//express library
const express = require('express');
const app = express();
//static files
app.use(express.static('public'));
const path = require('path');
//port
const HTTP_PORT = process.env.PORT || 8080;

const onHttpStart = ()=>{
    console.log(`Port Listening :${HTTP_PORT}`);
}
//initalize 
blogService.initialize() //u can alter the code format to place all endpoints to run inside of initalize function tbh 
  .then(() => {
    //Routes and server setup
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((error) => {
    console.error('Initialization error:', error);
  });
    //about
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});
    //blog
app.get('/blog', (req, res) => {
    blogService.getPublishedPosts()
    .then((publishedPosts) => {
        res.json(publishedPosts);
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
});
    //post
app.get('/posts', (req, res) => {
    blogService.getAllPosts()
    .then((posts) => {
        res.json(posts);
    })
    .catch((error) => {
        res.status(500).json({ message: error });
    });
});
    //categories
app.get('/categories', (req, res) => {
    blogService.getCategories()
    .then((categories) => {
        res.json(categories);
    })
    .catch((error) => {
        res.status(500).json({ message: error });
    });
});
    //404
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});
