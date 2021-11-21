const router = require("express").Router();
const {Comment, User, Post} = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require('../../utils/auth');

router.get("/", (req, res) => {
    console.log("======================");
    Post.findAll({
      attributes: [
        'id',
        'post_body',
        'title',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    }).then(postData => {
      res.json(postData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  });
  
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        "id",
        "post_body",
        "title",
        "created_at"
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    }).then(postData => {
      res.json(postData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
});

router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_body: req.body.post_body,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
Post.update(
    {
        title: req.body.title,
        post_body: req.body.post_body
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(postData => {
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!'});
            return;
        }
        res.json(postData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});

router.delete('/:id', withAuth, (req,res) => {
    Post.destroy({
        where: { 
            id: req.params.id
        }
    })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with this id!'});
                return;
            }
            res.json(postData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;