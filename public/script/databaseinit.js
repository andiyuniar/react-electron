var Dexie = require("dexie");
var database = new Dexie("raindrops");

database.version(1).stores({
  raindrops: "id,position",
});

database.open().catch(function (error) {
  console.error("ERROR: " + error);
});

module.exports = {
  database,
};
