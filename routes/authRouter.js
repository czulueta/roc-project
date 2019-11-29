const express = require("express")
const authRouter = express.Router()
const User = require("../models/user.js")
const jwt = require("jsonwebtoken")

// signup
authRouter.post("/signup", (req, res, next) => {
    // 1. Check if the user exists
    User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(user){
            res.status(400)
            return next(new Error("That username is already taken sorry"))
        }
        // 2. Create the user
        const newUser = new User(req.body)
        newUser.save((err, savedUser) => {
            if(err){
                res.status(500)
                return next(err)
            }
            // 3. Create a token // payload // signature
            const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET)
            // 4. Send back the user obj and the token
            return res.status(201).send({user: savedUser.withoutPassword(), token })
        }) 
    }) 
})


// login
authRouter.post("/login", (req, res, next) => {
    // 1. check to see if that user exists
    User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(!user){
            res.status(401)
            return next(new Error("Username or Password are incorrect"))
        }
        // 2. check to see if their password matches
        user.checkPassword(req.body.password, (err, isMatch) => {
            if(err){
                res.status(401)
                return next(err)
            }
            if(!isMatch){
                res.status(401)
                return next(new Error("Username or Password are incorrect"))
            }
            // 3. create token
            const token = jwt.sign(user.withoutPassword(), process.env.SECRET)
            // 4. send user obj and token
            return res.status(200).send({user: user.withoutPassword(), token})
        })
    })
}) 



module.exports = authRouter