// import { db } from "./db";
import Dexie from "dexie";
import { importDB } from "dexie-export-import";

const importJson = () => {
  onmessage = function (e) {
    testExportImport(e.data);
  };

  async function testExportImport(file) {
    // try {

    console.log(``);
    console.log(`Import() : dexie-export-import`);
    console.log(`=========`);
    // console.log(`Import 500,000 record from 1 json file into indexedDB! ...`);
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
        //console.log(e.name + ": " + e.message);

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
    // console.log(
    //   `Bulk Put operations done. Took ${Math.round(
    //     performance.now() - time
    //   )} milliseconds.`
    // );

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

    postMessage(`All Done.`);
  }
};

export default importJson;
