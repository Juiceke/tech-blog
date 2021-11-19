const router = require("express").Router();
const {User, Comment, Post} = require("../../models")

// get all users
router.get("/", (req, res) => {
    console.log("======================");
    User.findAll()
      .then((PostData) => {
        res.json({ PostData });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get("/:id", (req, res) => {
    User.findOne({})
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.post("/", (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
      .then((dbUserData) => {
          req.session.save(() => {
              // collect entered info and store it into the session
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              res.json(dbUserData);
          });
        })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post('/login', (req, res) => {
      // expects {email 'example@yahoo.com', password: '12345'}
      User.findOne({
          where: {
              email: req.body.email
          }
      }).then(dbUserData => {
          if (!dbUserData) {
            res.status(400).json({message: 'No user with that email address!'});
            return;
          }

          const validPassword = dbUserData.checkPassword(req.body.password);

          if (!validPassword) {
              res.status(400).json({ message: 'Incorrect password!'})
          }
      })
  })
  
  router.put("/:id", (req, res) => {
    Post.update(
      {
        title: req.body.title,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.delete("/:id", (req, res) => {
    console.log("id", req.params.id);
    Post.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  module.exports = router;
  

module.exports = router;
