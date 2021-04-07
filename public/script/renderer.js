const path = require("path");
// const isDev = require("electron-is-dev");

console.log("make a worker: ", path.resolve(__dirname, "./databaseworker.js"));
var worker;
// if (isDev) {
var worker = new Worker("./databaseworker.js");
// } else {
// var  worker = new Worker(path.resolve(__dirname, "./databaseworker.js"));
// }

worker.onmessage = function (event) {
  console.log("Database worker process is... ", event.data);
  worker.terminate();
};

worker.onerror = function (event) {
  console.error(event.message, event);
};
