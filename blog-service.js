/*********************************************************************************
//no significant changes made since version:
* WEB322 – Assignment 05

* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part

* of this assignment has been copied manually or electronically from any other source

* (including 3rd party web sites) or distributed to other students.

*

* Name: Lorenz Alvin Tubo Student ID: 1090934224 Date: 07/15/2023

*

* Cyclic Web App URL: https://easy-teal-elk-gear.cyclic.app/about

*

* GitHub Repository URL: https://github.com/YuhanPizza/web322-app

*

********************************************************************************/
//sequelize 
const {Sequelize, DataTypes} = require('sequelize');
//set up sequelize to point to our postgres database
var sequelize = new Sequelize('chcyjspl','chcyjspl','q1iCbG_DUaJHCYpssuZEKpPYazdvxoaf',{
  host: 'stampy.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions:{
    ssl:{rejectUnauthorized: false}
  },
  query: { raw: true},
  pool:{
    max:5,
    min:0,
    acquire: 30000,
    idle:10000
  }
})

sequelize.authenticate().then(()=>{
  console.log('connection has been established successfully.');
}).catch((err)=>{
  console.log('unable to connect to the data base:', err);
})


//Post model
const Post = sequelize.define('Post', {
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  featureImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

//Category model
const Category = sequelize.define('Category', {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
//relationship
Post.belongsTo(Category, { foreignKey: 'category' });
//initialize 
const initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject('Unable to sync the database');
      });
  });
};
//get all posts.

const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((posts) => {
        resolve(posts);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};

// filter through published post = true
const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true } })
      .then((posts) => {
        resolve(posts);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};
//categories
const getCategories = () => {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((categories) => {
        resolve(categories);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};
//add posts
const addPost = (postData) => {
  return new Promise((resolve, reject) => {
    postData.published = (postData.published) ? true : false;

    for (let key in postData) {
      if (postData[key] === "") {
        postData[key] = null;
      }
    }

    postData.postDate = new Date();

    Post.create(postData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject('Unable to create post');
      });
  });
};
//get post by cat
const getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category } })
      .then((posts) => {
        resolve(posts);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};
//getpost by date
const getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        postDate: { [Sequelize.Op.gte]: new Date(minDateStr) }
      }
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};
//getpost by id
const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { id } })
      .then((posts) => {
        if (posts.length > 0) {
          resolve(posts[0]);
        } else {
          reject('No results returned');
        }
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};

const getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true, category } })
      .then((posts) => {
        resolve(posts);
      })
      .catch(() => {
        reject('No results returned');
      });
  });
};
// addCategory
const addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    for (let key in categoryData) {
      if (categoryData[key] === "") {
        categoryData[key] = null;
      }
    }

    Category.create(categoryData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject('Unable to create category');
      });
  });
};

// deleteCategoryById
const deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({ where: { id } })
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          resolve();
        } else {
          reject('No category found with the specified ID');
        }
      })
      .catch(() => {
        reject('Failed to delete category');
      });
  });
};

// deletePostById
const deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({ where: { id } })
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          resolve();
        } else {
          reject('No post found with the specified ID');
        }
      })
      .catch(() => {
        reject('Failed to delete post');
      });
  });
};

//when this module is imported into another file using require the imported object will have access to 
//these properties. server.js can call these functions.
module.exports = {
  Post,
  Category,
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
  getPublishedPostsByCategory,
  addCategory,
  deleteCategoryById,
  deletePostById,
};