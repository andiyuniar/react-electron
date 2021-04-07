// import { database } from "./databaseinit.js";

const { database } = require("../../../databaseinit.js");

// console.log("Databaseworker...");

var drops = [];
for (var i = 1; i <= 1000; ++i) {
  drops.push({
    id: i,
    position: Math.random(),
    someData: {
      someText: "some value",
      someNumber: Math.random(),
    },
  });
}

try {
  database.raindrops.bulkPut(drops);
} catch (err) {
  console.log(err);
}

// function getAppRoot() {
//   if (process.platform === "win32") {
//     return path.join(app.getAppPath(), "/../../../");
//   } else {
//     return path.join(app.getAppPath(), "/../../../../");
//   }
// }
