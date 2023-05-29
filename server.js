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
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});
app.get('/',(req, res) => {
    res.redirect('/about');
})
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
        res.status(500).json({ message: error });//maybe try res.status(404).send(`Message${error}`);
    });
});
//me just stuff 
app.get('/me', (req, res) => {
    res.redirect('https://github.com/YuhanPizza');
  });
//404
//This use() will not allow req to go beyond it 
//so we place it at the end of the file, after other routes.
//This function will catch all other requests that dont match.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

