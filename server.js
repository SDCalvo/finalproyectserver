require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
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

const tagsRouter = require('./routes/tags.js');
app.use('/tags', tagsRouter);

const userRouter = require('./routes/user.js');
app.use('/user', userRouter);

const notesRouter = require('./routes/notes.js');
app.use('/notes', notesRouter);

const commentsRouter = require('./routes/comments.js');
app.use('/comments', commentsRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});