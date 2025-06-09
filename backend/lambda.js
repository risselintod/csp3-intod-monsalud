const serverless = require("@vendia/serverless-express");
const app = require("./index"); // Import your existing Express app

exports.handler = serverless( app );