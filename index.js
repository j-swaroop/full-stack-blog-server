const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())

const db = require("./models");
// Routers
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter);

const commentsRouter = require('./routes/Comments')
app.use("/comments", commentsRouter);

const usersRoute = require('./routes/Users')
app.use("/auth", usersRoute)

const likesRouter = require('./routes/Likes')
app.use('/likes', likesRouter)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log('Server running on Port 3001');
    })
}).catch((err) => {
    console.log(err)
})


