const router = require("express").Router();
const {Comment, User, Post} = require("../../models")



router.get("/", (req, res) => {
    console.log("======================");
    Post.findAll({
      attributes: [
        'id',
        'post_url',
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
        "post_url",
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

router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put(':id', (req, res) => {
Post.update(
    {
        title: req.body.title
    },
    {
        where: {
            id: req.params.id
        }
    }
)
    .then(postData => {
        res.json(postData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});

router.delete('/:id', (req,res) => {
    Post.destroy({
        where: { 
            id: req.params.id
        }
    })
        .then(postData => {
            res.json(postData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;