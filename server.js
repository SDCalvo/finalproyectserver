require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const mongoUri = process.env.DB_URI;

mongoose.connect( mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to DB "));
app.use(express.json());
app.use(cors());

const recipesRouter = require('./routes/recipes.js');
app.use('/recipes', recipesRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});