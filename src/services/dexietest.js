import Dexie from "dexie";
import {
  importDB,
  // exportDB,
  // importInto,
  // peakImportFile,
} from "dexie-export-import";
import blob from "../data/blob.json";

export default function starttest() {
  var db = new Dexie("raindrops");
  db.version(1).stores({
    raindrops: "id,position",
  });
  console.log("Using Dexie v" + Dexie.semVer);

  //
  // Prepare data
  //
  var drops = [];
  for (var i = 1; i <= 1000000; ++i) {
    drops.push({
      id: i,
      position: Math.random(),
      someData: {
        someText: "some value",
        someNumber: Math.random(),
      },
    });
  }

  testPerformance(db, drops);
}

export function testBlob(file) {
  // var db = new Dexie("exportSample");
  // db.version(1).stores({
  //   foos: "id",
  // });
  console.log("Using Dexie v" + Dexie.semVer);
  testExportImport(file);
}
//
// Test Performance
//
testPerformance().catch((err) => console.log(err));

async function testPerformance(db, drops) {
  try {
    //
    // Open Database
    //

    await db.open();
    console.log(``);
    console.log(`bulkPut()`);
    console.log(`=========`);
    console.log(`Let's put 1.000,000 documents into indexedDB! ...`);
    let time = performance.now();
    await db.raindrops.bulkPut(drops);
    console.log(
      `Bulk Put operations done. Took ${Math.round(
        performance.now() - time
      )} milliseconds.`
    );
    console.log(``);
    console.log(`Query`);
    console.log(`=====`);
    console.log(`Now query all documents within a small range...`);
    time = performance.now();
    const fewDrops = await db.raindrops
      .where("position")
      .between(0.5, 0.51)
      .toArray();
    console.log(
      `Took ${Math.round(performance.now() - time)} milliseconds to find ${
        fewDrops.length
      } matching documents`
    );
    console.log(`Now query all documents within a large range...`);
    time = performance.now();
    const manyDrops = await db.raindrops
      .where("position")
      .between(0.3, 0.7)
      .toArray();
    console.log(
      `Took ${Math.round(performance.now() - time)} milliseconds to find ${
        manyDrops.length
      } matching documents`
    );
    console.log(``);
    console.log(`Deleting`);
    console.log(`========`);
    console.log(`Now deleting all documents...`);
    time = performance.now();
    await db.raindrops.where("id").between(0, 1000000).delete();
    console.log(
      `Delete operaton done. Took ${Math.round(
        performance.now() - time
      )} milliseconds.`
    );
    console.log(`All Done.`);
  } catch (err) {
    switch (err && err.name) {
      case "TimeoutError":
        console.log(err.failures.length + "documents failed");
        break;
      case "BulkError":
        console.log(
          "Some documents did not succeed. However, " +
            1000000 -
            err.failures.length +
            " documents was added successfully"
        );
        break;
      case "MissingAPIError":
        console.log("Couldn't find indexedDB API");
        break;
      case "SecurityError":
        document.getElementById("log").style = "display:none";
        document.getElementById("safari-version").style = "display:";
        break;
      default:
        console.log(err);
        break;
    }
  }
}

export function createTestData() {
  var blobdata = blob;
  for (var i = 1; i <= 150000; ++i) {
    blobdata.data.data[0].rows.push({
      id: i,
      foo: Math.random(),
      date: 1614564554499,
    });
  }

  //blobdata.data.data[0].rows.push(rows);
  blobdata.data.tables[0].rowCount = blobdata.data.data[0].rows.length;
  console.log(JSON.stringify(blob));
}

async function testExportImport(file) {
  // try {

  console.log(``);
  console.log(`Import() : dexie-export-import`);
  console.log(`=========`);
  console.log(`Import 500,000 record from 1 json file into indexedDB! ...`);
  let time = performance.now();
  let staticOption = {
    progressCallback: (progress) => {
      console.log(`Total tables: ${progress.totalTables}`);
      console.log(
        `Processing ${progress.completedRows} / ${progress.totalRows}`
      );
    },
  };

  await importDB(file, staticOption)
    .then((result) => {
      console.log(
        `Bulk Put operations done. Took ${Math.round(
          performance.now() - time
        )} milliseconds.`
      );
    })
    .catch("TimeoutError", (e) => {
      console.log(e.name + ": " + e.message);

      switch (e && e.name) {
        case "BulkError":
          console.log("From total document," + e.failures.length + "failed");
          break;
        case "MissingAPIError":
          console.log("Couldn't find indexedDB API");
          break;
        case "SecurityError":
          document.getElementById("log").style = "display:none";
          document.getElementById("safari-version").style = "display:";
          break;
        default:
          console.log(e);
          break;
      }
    });
  console.log(
    `Bulk Put operations done. Took ${Math.round(
      performance.now() - time
    )} milliseconds.`
  );

  //
  let fileInfo = {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
  };

  let db = new Dexie("Logs");
  db.version(1).stores({
    logs: "++, name",
  });
  await db.open();
  await db.logs.add(fileInfo);

  console.log(`All Done.`);
}

export async function checkFileLog(file) {
  console.log(file);
  let db = new Dexie("Logs");
  await db.open().then((db) => {
    const table = db.table("logs");
    table
      .get({ name: file.name })
      .then((value) => {
        if (value) {
          console.log(`File ${file.name} has been uploaded`);
        } else {
          testBlob(file);
        }
      })
      .catch((err) => console.log(err));
  });
  db.close();
}
