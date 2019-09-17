var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Used also for components :)
var ServerFlowSchema = mongoose.Schema({
    has_system_owner_informed: {
        checked: Boolean
    },
    was_test_migration_possible: {
        checked: Boolean
    },
    planning_start: {
        checked: Boolean,
        date: Date
    },
    planning_end: {
        checked: Boolean,
        date: Date
    },
    was_test_migration_executed: {
        checked: Boolean
    },
    attributes_instance: {
        checked: Boolean
    },
    has_open_work: {
        checked: Boolean
    },
    was_test_migration_successfull: {
        checked: Boolean,
        content: [{
            old_name: String,
            new_name: String
        }]
    },
    is_app_owner_known: {
        checked: Boolean,
        message: String
    },
    attributes: {
        
    }
}, {strict: false, timestamps: false});


module.exports = ServerFlowSchema;