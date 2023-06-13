/*********************************************************************************

* WEB322 – Assignment 02

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
//streamifier
const streamifier = require('streamifier');
//cloudinary 
const cloudinary = require('cloudinary').v2;
//multer
const multer = require('multer');
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
//cloudinary config
cloudinary.config({
    cloud_name:'dusfrwsg5',
    api_key:'213224212869577',
    api_secret:'_m0gWsKSCmTZADZl90nZkXkGj30',
    secure:true
});
//upload variable w/o disk storage
const upload = multer();// no {storage: storage }
//post route
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      }
  
      upload(req)
        .then((uploaded) => {
          processPost(uploaded.url);
        })
        .catch((error) => {
          console.error('Image Upload Failed: ',error);
          res.status(500).send("Image upload failed.");
        });
    } else {
      processPost("");
    }
  
    function processPost(imageUrl) {
      req.body.featureImage = imageUrl;
      const newPost = {
        featureImage: req.body.featureImage,
        // Add other properties from req.body as needed
      };
  
      blogService
        .addPost(newPost)
        .then(() => {
          res.redirect("/posts");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error creating new post.");
        });
    }
  });
//initalize 
blogService.initialize() 
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
    const { category, minDate } = req.query;
  
    if (category) {
      blogService.getPostsByCategory(category)
        .then((posts) => {
          res.json(posts);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    } else if (minDate) {
      blogService.getPostsByMinDate(minDate)
        .then((posts) => {
          res.json(posts);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    } else {
      blogService.getAllPosts()
        .then((posts) => {
          res.json(posts);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    }
});
app.get('/post/add',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/addPost.html'));
})
//post by Id
app.get('/post/:value', (req, res) => {
    const postId = req.params.value;
  
    blogService.getPostById(postId)
      .then((post) => {
        if (post) {
          res.json(post);
        } else {
          res.status(404).json({ message: 'Post not found.' });
        }
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
        res.status(500).json({ message: error });//or res.status(404).send(`Message${error}`);
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

