// Important
// See ./flow/* for real models

const workflow = [{
    restrict: "server",
    code: "is_system_owner_known",
    type: "input",
    category: "planning",
    attribute: "owner",
    true: {
        status: 'progress'
    },
    false: {
        status: 'progress'
    }
}, {
    restrict: "applications",
    code: "is_app_owner_known",
    type: "input",
    attribute: "owner",
    category: "planning",
    true: {
        status: 'progress'
    },
    false: {
        status: 'progress'
    }
}, {
    restrict: "server",
    code: "has_system_owner_informed",
    category: "planning",
    type: "boolean",
    true: {
        status: 'progress'
    },
    false: {
        status: 'error'
    }
}, {
    restrict: "applications",
    code: "has_app_owner_informed",
    category: "planning",
    type: "boolean",
    true: {
        status: 'progress'
    },
    false: {
        status: 'error'
    }
}, {
    code: "was_test_migration_possible",
    type: "boolean",
    category: "planning",
    true: {
        status: 'progress'
    },
    false: {
        status: 'progress'
    }
}, {
    code: "planning_start",
    type: "datetime",
    category: "planning",
    true: {
        status: 'progress'
    },
    false: {
        status: 'error'
    }
}, {
    code: "planning_end",
    type: "datetime",
    category: "planning",
    true: {
        status: 'progress'
    },
    false: {
        status: 'error'
    }
}, {
    code: "was_test_migration_executed",
    type: "boolean",
    category: "migration",
    true: {
        status: 'progress'
    },
    false: {
        status: 'progress'
    }
}, {
    code: "attributes_instance",
    type: "attributes",
    category: "inventory",
    true: {
        status: 'progress',
        inventory: true
    },
    false: {
        status: 'progress',
        inventory: false
    }
}, {
    code: "has_open_work",
    type: "boolean",
    category: "migration",
    true: {
        status: 'progress'
    },
    false: {
        status: 'progress'
    }
}, {
    code: "was_test_migration_successfull",
    type: "server_move",
    category: "migration",
    true: {
        status: 'done',
        migrated: true
    },
    false: {
        status: 'error',
        migrated: false
    }
}];


module.exports = workflow;