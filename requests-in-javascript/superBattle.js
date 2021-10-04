const {Superbattle} = require("./requests.js");

Superbattle(process.argv[2], process.argv[3]).then(console.log);