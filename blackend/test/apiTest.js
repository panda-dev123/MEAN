const request         = require('supertest');
const should          = require('should');
const express         = require('express');
const cookieParser    = require('cookie-parser');
const app             = require('./main');
const config          = require('./config');
const mongoose        = require('mongoose');


describe('Testing process classes', () => {
    require('./src/classes/workflow/inventory')(app);
    require('./src/classes/workflow/planning')(app);
    require('./src/classes/workflow/migration')(app);
    // require('./src/classes/itemflow')(app);
});


describe('Testing workflows/migrations', () => {
    require('./src/serverflow')(app);
    require('./src/appflow')(app);
});