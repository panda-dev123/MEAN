const request         = require('supertest');
const should          = require('should');
const config          = require('../config');
const assert          = require('assert');
const InstanceModel   = require('../../src/models/instance');
const HistoryModel    = require('../../src/models/history');


module.exports = function(app) {
    describe('Server (ONLY) migration process', function () {
        require('./classes/process/serverInventory')(app);
        require('./classes/process/serverPlanning')(app);
        require('./classes/process/serverPlanningError')(app);
        require('./classes/process/serverMigration')(app);
    });
};