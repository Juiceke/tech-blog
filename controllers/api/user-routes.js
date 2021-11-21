const router = require("express").Router();
const {User, Comment, Post} = require("../../models")

// get all users
router.get("/", (req, res) => {
    console.log("======================");
    User.findAll({
        attributes: { exclude: ['password']}
    })
      .then((userData) => {
        res.json({ userData });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_body', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
            }
        },
        ]
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No user found with this id" });
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
              res.status(400).json({ message: 'Incorrect password!'});
              return;
          }

          req.session.save(() => {
              // save id and username from the data posted, then make loggedIn true.
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              res.json({ user: dbUserData, message: 'You are now logged in!'});
          });
      });
  });
  
  router.post('/logout', (req, res) => {
      if (req.session.loggedIn) {
          req.session.destroy(() => {
              res.status(204).end();
          });
      }
      else {
          res.status(404).end();
      }
  });

  router.put("/:id", (req, res) => {
    User.update( req.body, {
        individualHooks: true,
        where: {
          id: req.params.id,
        },
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.delete("/:id", (req, res) => {
    console.log("id", req.params.id);
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No user found with this id" });
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
