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
//client sessions
const clientSessions = require('client-sessions');
//auth-service
const authData = require("./auth-service");
//strip-js
const stripJs = require("strip-js");
//handlebars
const exphbs = require("express-handlebars");
//streamifier
const streamifier = require("streamifier");
//cloudinary
const cloudinary = require("cloudinary").v2;
//multer
const multer = require("multer");
//require blog-service
const blogService = require("./blog-service");
//express library
const express = require("express");
const app = express();
//static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const path = require("path");
//port
const HTTP_PORT = process.env.PORT || 8080;

const onHttpStart = () => {
  console.log(`Port Listening :${HTTP_PORT}`);
};


//strip-Js custom Helper
exphbs.create({}).handlebars.registerHelper("safeHTML", function (context) {
  return stripJs(context);
});

//handle-bars config
app.engine(".hbs", exphbs.engine({ extname: ".hbs", helpers:{formatDate: function(dateObj){
  let year = dateObj.getFullYear();
  let month = (dateObj.getMonth() + 1).toString();
  let day = dateObj.getDate().toString();
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
}
} }));
app.set("view engine", ".hbs");
//cloudinary config
cloudinary.config({
  cloud_name: "dusfrwsg5",
  api_key: "213224212869577",
  api_secret: "_m0gWsKSCmTZADZl90nZkXkGj30",
  secure: true,
});
//upload variable w/o disk storage
const upload = multer(); // no {storage: storage }
//custom middleware
app.use(
  clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "long_un_guessable_string", // this should be a long un-guessable string.
    duration: 5 * 60 * 1000, // duration of the session in milliseconds (5 minutes)
    activeDuration: 1000 * 60 * 5, // Session will be extended by 5 minutes on each request
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}
// Middleware function
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

// Custom handle-bars helper
exphbs.create({}).handlebars.registerHelper("navLink", function (url, options) {
  return (
    "<li" +
    (url == app.locals.activeRoute ? ' class="active" ' : "") +
    '><a href="' +
    url +
    '">' +
    options.fn(this) +
    "</a></li>"
  );
});
//login stuff 

// GET route to render the login view
app.get("/login", function (req, res) {
  res.render("login");
});

// GET route to render the register view
app.get("/register", function (req, res) {
  res.render("register");
});

// POST route to handle user registration
app.post("/register", function (req, res) {
  authData
    .registerUser(req.body)
    .then(() => {
      res.render("register", { successMessage: "User created" });
    })
    .catch((err) => {
      res.render("register", { errorMessage: err, userName: req.body.userName });
    });
});

// POST route to handle user login
app.post("/login", function (req, res) {
  req.body.userAgent = req.get("User-Agent");

  authData
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect("/posts");
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

// GET route to handle user logout
app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/");
});

// GET route to render the userHistory view
app.get("/userHistory", ensureLogin, function (req, res) {
  res.render("userHistory");
});
//post route
app.post("/posts/add",ensureLogin, upload.single("featureImage"), (req, res) => {
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
        processPost(uploaded.url,req,res);
      })
      .catch((error) => {
        console.error("Image Upload Failed: ", error);
        res.status(500).send("Image upload failed.");
      });
  } else {
    processPost("",req,res);
  }

  function processPost(imageUrl ,req ,res ) {
    req.body.featureImage = imageUrl;
    const newPost = {
      body: req.body.body,
      title:req.body.title,
      category:req.body.category,
      featureImage: req.body.featureImage,
      published:req.body.published,
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
blogService
  .initialize()
  .then(authData.initialize)
  .then(() => {
    //Routes and server setup
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((error) => {
    console.error("Initialization error:",error);
  });
//about
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/", (req, res) => {
  res.redirect("/blog");
});
//blog
app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};
  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogService.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogService.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = posts[0];

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});
//post
app.get("/posts",ensureLogin, (req, res) => {
  const { category, minDate } = req.query;

  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((posts) => {
        if (posts.length > 0) {
          res.render("posts", { posts: posts });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: "no results" });
      });
  } else if (minDate) {
    blogService
      .getPostsByMinDate(minDate)
      .then((posts) => {
        if (posts.length > 0) {
          res.render("posts", { posts: posts });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: "no results" });
      });
  } else {
    blogService
      .getAllPosts()
      .then((posts) => {
        if (posts.length > 0) {
          res.render("posts", { posts: posts });
        } else {
          res.render("posts", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("posts", { message: "no results" });
      });
  }
});
//post add 
app.get("/posts/add",ensureLogin, (req, res) => {
  blogService.getCategories().then((categories)=>{
    res.render("addPost",{categories});
  }).catch(()=>{
    res.render("addPost",{categories:[]});
  });
});
//categories add
app.get("/categories/add",ensureLogin, (req, res) => {
  res.render("addCategory");
});
//post by Id
app.get("/post/:value",ensureLogin, (req, res) => {
  const postId = req.params.value;

  blogService
    .getPostById(postId)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Post not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});
//post delete id
app.get("/posts/delete/:id",ensureLogin, (req, res) => {
  const postId = req.params.id;

  blogService
    .deletePostById(postId)
    .then(() => {
      res.redirect("/posts");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Unable to remove post / Post not found.");
    });
});

//categories
app.get("/categories",ensureLogin, (req, res) => {
  blogService
    .getCategories()
    .then((categories) => {
      if (categories.length > 0) {
        res.render("categories", { categories });
      } else {
        res.render("categories", { message: "no results" });
      }
    })
    .catch((error) => {
      res.render("categories", { message: "no results" });
    });
});
//categories add post
app.post("/categories/add",ensureLogin, (req, res) => {
  const newCategory = {
    category: req.body.category,
  };

  blogService
    .addCategory(newCategory)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating new category.");
    });
});
//categories delete id
app.get("/categories/delete/:id", ensureLogin, (req, res) => {
  const categoryId = req.params.id;

  blogService
    .deleteCategoryById(categoryId)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Unable to remove category / Category not found.");
    });
});
app.get("/blog/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let posts = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogService.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogService.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the post by "id"
    viewData.post = await blogService.getPostById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

//me just stuff
app.get("/me", (req, res) => {
  res.redirect("https://github.com/YuhanPizza");
});
//404
//This use() will not allow req to go beyond it
//so we place it at the end of the file, after other routes.
//This function will catch all other requests that dont match.
app.use((req, res) => {
  res.status(404).render('404');
});
