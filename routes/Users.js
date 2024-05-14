const express = require('express')
const router = express.Router()
const {Users, Posts, Likes} = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validateToken} = require('../middlewares/AuthMiddleware')

router.post('/', async (request, response) => {
    const { username, password} = request.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await Users.findOne({
        where: {
            username: username
        }
    })

    if (user !== null){
        response.json({msg: "User Already Exist"})
    }else{
        await Users.create({
            username: username,
            password: hashedPassword
        })

        response.json({msg: 'Successfully Registered Please Login'})
    }

})


router.post('/login', async (request, response) => {
    const {username, password} = request.body

    const user = await Users.findOne({
        where: {
            username: username
        }
    })

    if (user === null){
        response.json({error: "User doesn't exist please register! by clicking sign up"})
    }
    else{
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched){
            response.json({error: 'Wrong Username And Password Combination'})
        }
        else{
            const payLoad = {
                username: user.username,
                id: user.id
            }

            const jwtToken = jwt.sign(payLoad, "SECRETTTTOKENN")
            response.json({jwtToken: jwtToken, username: user.username, id: user.id })
        }
    }

})

router.get('/auth', validateToken, async (request, response) => {
    response.json(request.user)
})

router.get('/profile-info/:id', async (request, response) => {
    const {id} = request.params

    const basicInfo = await Users.findByPk(id, { attributes: { exclude: ["password"] } })

    response.json(basicInfo)
})

module.exports = router 
