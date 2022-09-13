const express = require("express")
const app = express()

app.use(express.json())

const userRouter = require('./routes/user-management-controller')
app.use('/users', userRouter)

app.listen(9000, () => {
    console.log('Server Started')
})