const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const public = require('./routes/public.routes');
const spotify = require('./routes/spotify.routes');
const user = require('./routes/user.routes');
require('dotenv').config();
require('./database').connect();

const app = express();
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
//Format responses to work with Angular
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    next()
})

app.use('/api/spotify', spotify)
app.use('/api', public);

module.exports = app