const express = require("express");
const router = express.Router();
const {Likes} = require('../models')
const {validateToken} = require('../middlewares/AuthMiddleware');

router.post('/', validateToken, async (request, response) => {
    const {PostId} = request.body
    const userId = request.user.id
    
    const found = await Likes.findOne({
        where: {
            PostId: PostId,
            UserId: userId
        }
    })

    if (found === null){
        await Likes.create({
            PostId: PostId,
            UserId: userId
        })
        response.json({isLiked: true})
    }else{
        await Likes.destroy({
            where: {
                PostId: PostId,
                UserId: userId
            }
        })
        response.json({isLiked: false})
    }
    

    
})

module.exports = router