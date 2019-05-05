const express = require("express")
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fancytodo', {useNewUrlParser: true});

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/todo", require("./routes/todo.js"))
app.use("/user", require("./routes/user.js"))

const PORT = 3000
app.listen(PORT, () => { console.log("Server started on port 3000") })