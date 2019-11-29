const express = require("express")
const app = express()
require("dotenv").config()
const morgan = require("morgan")
const mongoose = require("mongoose")
const expressJwt = require("express-jwt")
const PORT = process.env.PORT || 7000


// Middlware fire on every request
app.use(morgan("dev"))
app.use(express.json())

// Db connect
mongoose.connect("mongodb://localhost:27017/delivery-service",
{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: false
}, () => console.log("connected to the DB"))


// Routes
app.use("/api", expressJwt({secret: process.env.SECRET})) // creates req.user._id
app.use("/auth", require("./routes/authRouter.js"))

// Error Handler
app.use((err, req, res, next) => {
    console.error(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

// Listen
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))