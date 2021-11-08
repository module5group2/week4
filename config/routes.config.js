const express = require('express');
const post = require('../controllers/posts.controllers');
const user = require('../controllers/users.controllers');
const auth = require('../middleware/auth.middleware');


const router = express.Router();

router.post('/users', user.create)
router.post('/users/:id/activate', user.validate)
router.post('/login', user.login)

router.get('/logout', auth.isAuthenticated, user.logout)

router.get('/posts', auth.isAuthenticated, post.getAllPosts)
router.get('/posts/:id', auth.isAuthenticated, post.getPostById)
router.post('/posts', auth.isAuthenticated, post.createPost)
router.patch('/posts/:id', auth.isAuthenticated, post.updatePost)
router.delete('/posts/:id', auth.isAuthenticated, post.deletePost)

module.exports = router;