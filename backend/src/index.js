const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose
  .connect(
    `mongodb+srv://project-ecommer:${process.env.MONGO_DB}@cluster0.1lnoi.mongodb.net/project_web?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
