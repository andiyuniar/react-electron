import IDBExportImport from 'indexeddb-export-import';
import Dexie from 'dexie';
import { openDB } from 'idb';

const dbname = "testdb";
const store = "esjson"


export const initdb = () => {
  return openDB(dbname, 1, {
        upgrade(db) {
          console.log(db);
          db.createObjectStore(store, { autoIncrement: true });
        }
      })
}

export const exportJson = async (jsonStr) => {
  const db = await openDB(dbname, 1);
  db.add(store, jsonStr)
  .then( result => {
    console.log('Success, ', result);
  })
  .catch(err => {
    console.log('error:', err)
  });

  db.close();
}



// const db = new Dexie('myDb');
// db.version(1).stores({
//   esjson: `id++, Library, Album, Categories`
// });



// export const importJsonStr = async (jsonString) => {
//   console.log('start importing...:', jsonString);
  
//   db.open().then(() => {
//     const idbdatabase = db.backendDB();
//     IDBExportImport.importFromJsonString(idbdatabase, jsonString, (err) => {
//       if (!err) {
//        console.log('Imported data successfully');
//       } else {
//         console.error(err)
//       }
//    });
//   })
  
    

//    }

   
   
   


export const exportJsonStr = async () => {
  // const db = await openDB(dbname, 1);
  // IDBExportImport.exportToJsonString(db, function(err, jsonString) {
  //   if(err) {
  //     console.error(err);
  //   } else {
  //     console.log('Exported as JSON: ' + jsonString)
  //   }
  // })
}