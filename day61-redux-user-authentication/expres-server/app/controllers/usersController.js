const User = require('../models/user')
const Note = require('../models/note')
const jwt = require('jsonwebtoken')

module.exports.users = (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(error => {
            res.json(error)
        })
}

module.exports.create = (req,res) => {
    const body = req.body
    const user = new User(body)
    user.save()
        .then(user => {
            res.json(user)
        })
        .catch(error=> {
            res.json(error)
        })
}

module.exports.login = (req, res) => {
    const body = req.body
    User.findByCredentials(body)
        .then(user => {
            return user.generateToken()
        })
        .then(token => {
            console.log("token is ", token)
            res.send({token})
            // res.setHeader('x-auth', token).send()
        })
        .catch(error => {
            res.send(error)
        })

    // User.findOne({email: body.email})
    //     .then(user => {
    //         if(!user){
    //             res.status('404').send({message: "Invalid Email / Password"})
    //         }

    //         bcryptjs.compare(body.password,user.password)
    //             .then(function(result){
    //                 if(result){
    //                     res.send({message: "User successfully logged in"})
    //                 }else{
    //                     res.send({message: "Invalid Email / Password"})
    //                 }
    //             })
    //             .catch(function(error){
    //                 res.send(error)
    //             })
    //     })
    //     .catch(error => {
    //         res.json(error)
    //     })
}

module.exports.account = (req, res) =>{
    const {user} = req
    

    res.send(user)
    // const token = req.header('x-auth')
    // if(token){
    //     User.findByToken(token)
    //         .then(user => {
    //             res.send(user)
    //         })
    //         .catch(error => {
    //             res.status('401').send(error)
    //         })
    // }
    // else{
    //     res.status('401').send({message: "Unauthorized user"})
    // }
}

module.exports.logout = (req, res) => {
    const { user , token}= req       
    User.findByIdAndUpdate(user._id, {$pull: {tokens: {token: token}}})
        .then(user => {
            res.send({message:"Successfully Logged Out"})
        })
        .catch(error => {
            res.send(error)
        })
}

module.exports.update = (req,res) => {
    const body = req.body
    const id = req.params.id 
    User.findByIdAndUpdate(id, {$set: body},{new: true, runValidators: true})
        .then(user => {
            res.json(user)
        })
        .catch(error=> {
            res.json(error)
        })
}

module.exports.show = (req, res) => {
    const id = req.params.id
    Promise.all([User.findById(id), Note.find({user: id})])
        .then(response => {
            res.json({user: response[0], notes: response[1]})
        })
        .catch(error => {
            res.json(error)
        })
}

module.exports.delete = (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(user => {
            res.json(user)
        })
        .catch(error => {
            res.json(error)
        })
}