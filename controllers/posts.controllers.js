const createError = require('http-errors');
const Post = require("../models/post.model");

module.exports.getAllPosts = (req, res, next) => {
    Post.find()
    .then(post => {
        if (post) {
          res.json(post)
        } else {
          next(createError(400, 'Post not found'))
        }
      })
    .catch(next)
}

module.exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.json(post)
      } else {
        next(createError(404, 'Post not found'))
      }
    })
    .catch(next)
};

module.exports.createPost = (req, res, next) => {
    const data = { title, text, author } = req.body

    Post.create({
      ...data    
    })
    .then((post) => res.status(201).send(post))
    .catch(next)

}

module.exports.updatePost = (req, res, next) => {
    const data = { title, text, author }= req.body;
    console.log('data>>',data);

    Post.findByIdAndUpdate(req.params.id, data, { new: true })
    .then(post => {
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({message: `Post with id ${req.params.id} not found`})
      }
      
    })
    .catch(next)
}

module.exports.deletePost = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .then(post => {
      if(post){
        res.status(204).end()
      }else{
        res.status(404).json({message: `Post with id ${req.params.id} not found`})
      }      
    })
    .catch(next)
}
