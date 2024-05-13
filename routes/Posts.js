const express = require("express");
const router = express.Router();
const {Posts, Likes} = require('../models')
const {validateToken} = require('../middlewares/AuthMiddleware');


router.get('/', validateToken, async (request, response) => {
    const listOfPosts = await Posts.findAll({ include: [Likes]})
    const likedPosts = await Likes.findAll({ where: { UserId: request.user.id } })

    response.json({listOfPosts: listOfPosts, likedPosts: likedPosts})
});

router.get('/byId/:id', async (request, response) => {
    const id = request.params.id 

    const post = await Posts.findByPk(id)
    response.json(post)
    
})

router.get('/byuserId/:id', async (request, response) => {
    const id = request.params.id 

    const listOfPosts = await Posts.findAll({ where : {UserId: id}, include: [Likes]})
    response.json(listOfPosts)
    
})

router.post('/', validateToken, async (request, response) => {
    const post = request.body
    post.username = request.user.username
    post.UserId = request.user.id
    
    await Posts.create(post)

    response.json(post);

});


router.put('/title', validateToken, async (request, response) => {
    const {newTitle, id} = request.body

    await Posts.update({title: newTitle}, { where : { id: id } })

    response.json(newTitle)
})

router.put('/postText', validateToken, async (request, response) => {
    const {newText, id} = request.body

    await Posts.update({postText: newText}, { where : { id: id } })
    response.json(newText)
})


router.delete('/:postId', validateToken, async (request, response) => {
    const postId = request.params.postId

    await Posts.destroy({
        where: {
            id: postId
        }
    })
})

module.exports = router 