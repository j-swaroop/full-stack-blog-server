const jwt = require('jsonwebtoken')

const validateToken = (request, response, next) => {
    const accessToken = request.header('accessToken')

    if (!accessToken) {
        return response.json({error: 'User not logged in!'})
    }

    try{
        const isValidToken = jwt.verify(accessToken, 'SECRETTTTOKENN')
        request.user = isValidToken
        if (isValidToken){
            return next()
        }
    }catch(err){
        return response.json({error: err})
    }
}

module.exports = {validateToken}