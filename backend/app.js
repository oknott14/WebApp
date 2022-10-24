const express = require('express');
const bodyParser = require('body-parser');
const spotify = require('./routes/spotify')
const app = express();


//Format responses to work with Angular
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    next()
})

app.use('/api/spotify', spotify)

module.exports = app