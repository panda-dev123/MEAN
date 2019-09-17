/**
 *  Insert list of servers to the database.
 *  Used as init script.
 */
const Extractor         = require('../src/classes/Extractor');
const Excel             = require('../src/classes/Excel');
const fs                = require('fs');
const mongoose          = require('mongoose');
const async             = require('async');
const config            = require('../src/config');
const logger            = require('../src/classes/Logger');
const Instance          = require('../src/models/instance');

exports.serverReal = function(callback) {
    mongoose.connect(config.database_address, {useNewUrlParser: true}, function(err) {
        if (!err) {
            // logger.info("Connected to MongoDB using " + config.database_address);
        } else {
            logger.error("Can\'t connect to MongoDB using ' + config.database_address");
            return false;
        }
    });

    var rows = JSON.parse(fs.readFileSync('../queue/json/ExportCMDB.xlsx/Tabelle1_1.json'));
    rows = Extractor.excludeColumns(rows, [0]);
    var header = rows.shift();

    rows = Extractor.filterRows(rows, [{
        "index": 1,
        "value": "Server"
    }]);

    var serverIndex = 0;

    async.eachSeries(rows, function(row, done) {
        const name = row[serverIndex];
        var instance = new Instance({
            name: row[serverIndex],
            attributes: {},
            applications: [],
            components: [],
            comments: [],
            type: 'server',
            status: 'open',
            migrated: false,
            planned: false,
            inventory: false,
            workflow: {}
        });

        var attrs = {};
        for (var i = 0; i < row.length; i++) {
            if (i == serverIndex) {
                continue;
            }
            attrs[header[i].toLowerCase()] = row[i];
        }
        instance.attributes = attrs;

        instance.save(function (err, savedInstance) {
            if (err) {
                console.log("Error: " + JSON.stringify(err));
            }
            // console.log("inserted " + name);
            done();
        });
    }, function allDone (err) {
        console.log("[InitScript]: " + rows.length + " servers has been inserted!");
        callback();
    });
};