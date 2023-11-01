const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

const dbName = "miniFilms"
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true, useUnifiedTopology: true, dbName:dbName});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
// mongoose.connect(process.env.DB_CONNECTOR, () => {
//     console.log("MiniFilms Database is connected to Node")
// })


const filmsRoute = require('./routes/films')
// const film = require('./models/film')
app.use('/api/film', filmsRoute)

const authRoute = require('./routes/auth')
app.use(bodyParser.json())
app.use('/api/user', authRoute)

app.listen(3000, () => {
    console.log("Server is running..")
})


