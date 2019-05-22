const express = require('express')
const app = express()
const port = 3000
const index=require('./router/index')
const cors = require('cors')

app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(express.json())

app.use('/', index)

app.listen(port, ()=>console.log('listening to port :3000'))

