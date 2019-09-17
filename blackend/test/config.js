var config = require('../src/config');
var JWT    = require('../src/classes/JWTProxy');

config.jwt_token = JWT.sign(JSON.parse(JSON.stringify({"name":"Tesla"})));
config.database_address = "mongodb://127.0.0.1/moveit_test";
config.port = "3001";
config.url_base = "/api/v1";
config.log_dir = "logs/tests/";
config.log_level = "error";

module.exports = config;