import { readFileSync } from "fs";
import React from "react";
// import { initdb, exportJson } from "../services/exportImportService";
// import data from "../data/esdata-test.json";
import starttest, {
  testBlob,
  createTestData,
  checkFileLog,
} from "../services/dexietest";
import { ReadDirectory } from "../services/fileService";

const TestUpload = () => {
  const start = () => {
    // console.log('start');
    // console.log(data);
    // initdb();

    // console.time("processing")
    // for (var i = 0; i < 100000; i++) {
    //   exportJson(data);
    // }
    // console.timeEnd("processing")
    //const input = document.getElementById("jsonfile");

    starttest();
  };

  // const importStart = () => {
  //   testBlob();
  // };

  const onChangeHandler = (e) => {
    let files = e.target.files;

    for (const file of files) {
      // console.log(file);
      // let exist = false;
      // checkFileLog(file.name).then(result => { exist = result});

      // console.log(exist);
      // check whether the file alrready uploaded
      checkFileLog(file);
    }
  };

  const createdata = () => {
    createTestData();
  };

  const CheckDirectory = () => {
    ReadDirectory();
  };

  return (
    <React.Fragment>
      <div>
        <h3>TEST EXPORT IMPORT DATA</h3>
        <button id="start" type="button" onClick={start}>
          Start bulk put
        </button>
      </div>
      <div>
        Import: <input type="file" onChange={onChangeHandler} multiple />
      </div>
      <div>
        <button id="start" type="submit" onClick={createdata}>
          create data
        </button>
      </div>
      <div>
        <button id="cek folder" type="button" onClick={CheckDirectory}>
          Read Directory
        </button>
      </div>
    </React.Fragment>
  );
};

export default TestUpload;
