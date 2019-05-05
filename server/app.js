require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const errorHandler = require("./helpers/error-handler-helper");
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/fancy-todo-1", { useNewUrlParser: true })
  .then(
    () => { console.log("Connected to database") },
    err => { console.log("Failed to connect to database:", err) }
  );

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/", routes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));