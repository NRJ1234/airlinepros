const express = require("express")
const router = express.Router()
const userService = require('../service/user-management-service')

router.get('/getUsers', auth, async(req,res) => {
    try {
        const userObj = new userService()
        userObj.getUsers((result) => {
            res.json(result)
        })
    } catch(e) {
        res.end("failed")
    }    
})

router.get('/getUser', async(req,res) => {
    try {
        const userObj = new userService()
        userObj.getUser(req.body, (result) => {
            res.json(result)
        })
    } catch(e) {
        res.end("failed")
    }    
})

router.post('/bulkImport', async(req, res) => {
    try {
        const userObj = new userService()
        userObj.bulkImport(req, (result) => {
            res.status(200).json(result)
        })
        
    } catch(e) {
        res.status(500).json("bulkImport failed")
    }
})

router.post('/login', auth, async(req, res) => {
    try {
        res.end("Login success")
    } catch(e) {
        res.end("failed")
    }
})

router.patch('/updateUser',authSuperUser, auth, async(req, res) => {
    try {
        const userObj = new userService()
        userObj.updateUser(req.body, (result) => {
            res.json(result)
        })
    } catch(e) {
        res.end("failed")
    }
})

router.delete('/deleteUser', authSuperUser, auth, async(req, res) => {
    try {
        const userObj = new userService()
        userObj.deleteUser(req.body, (result) => {
            res.json(result)
        })
    } catch(e) {
        res.end("failed")
    }
})

function authSuperUser(req, res, next) {
    if(req.headers.role == 1) {
        next()
    } else {
        res.json("Insufficient permissions")
    }
}

function auth(req, res, next) {
    const userObj = new userService()
    userObj.validateUser(req.headers, (result) => {
        if (result != 0)
            next()
        else
            res.json("Auth Failed!!!!")
    })
}
module.exports = router