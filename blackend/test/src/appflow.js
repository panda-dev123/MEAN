const request         = require('supertest');
const should          = require('should');
const config          = require('../config');
const assert          = require('assert');
const InstanceModel   = require('../../src/models/instance');
const HistoryModel    = require('../../src/models/history');


module.exports = function(app) {
    describe('App migration process', function () {
        require('./classes/process/appInventory')(app);
        require('./classes/process/appPlanning')(app);
        require('./classes/process/appPlanningError')(app);
        require('./classes/process/appMigration')(app);
    });
};