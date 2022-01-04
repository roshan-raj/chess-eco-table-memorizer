const express = require('express');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

//Create express object
const app = express();

//===============================================================================

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
        ttl: 1800000
    }),
    resave: false,
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true
}))

//===============================================================================

//Require all the routes
const scrapeRoutes = require('./routes/scrapeRoute');

app.use('/', scrapeRoutes);

module.exports = app;