import { openDB } from 'idb';

const DBNAME = 'TODOLIST';
const DBVERSION = 1;
const STORENAME = 'todo';

export class dbService {

  constructor () {
    this.db = openDB(DBNAME, DBVERSION, {
      upgrade(db) {
        console.log(db);
        //db.createObjectStore(STORENAME, { autoIncrement: true });
        db.createObjectStore(STORENAME, { keyPath: 'id' });
      }
    });
  }

  async insert(data){
    return (await this.db).add(STORENAME, data);
  }

  async insertTrx(data, storeNames = null){
    if (storeNames === null) storeNames = STORENAME;
    const db = await this.db;
    let trx = db.transaction(storeNames, 'readwrite');

    data.forEach(element => {
      trx.store.add(element);
    });

    return trx.done;
  }

  async getAll() {
    const db = await this.db;
    return db.getAll(STORENAME);
  }

  async delete(id) {
    const db = await this.db;
    return db.delete(STORENAME, id);
  }

  async close() {
    (await this.db).close();
  }
}




// const DATABASE_NAME = 'AGENT_ALBUM';
// const DATABASE_VERSION = 1;
// const storeName = 'album';

// // const db = openDB(DATABASE_NAME, DATABASE_VERSION);



// // create database
// export const initDb = () => {
//   return openDB(DATABASE_NAME, DATABASE_VERSION, {
//     upgrade(db) {
//       console.log(db);
//       db.createObjectStore(storeName, { autoIncrement: true });
//     }
//   })
// }

// // insert without transaction
// export const insert = async (data) => {
//   const db = await openDB(DATABASE_NAME, DATABASE_VERSION);
//   db.add(storeName, data)
//   .then( result => {
//     console.log('Success, ', result);
//   })
//   .catch(err => {
//     console.log('error:', err)
//   });

//   db.close();
// }

// // insert with transaction for multiple or single object stores
// export const insertTrx = async (data) => {
//   console.log('inserting with transaction..');
//   const db = await openDB(DATABASE_NAME, DATABASE_VERSION);
//   let trx = db.transaction([storeName], 'readwrite');
  
//   data.forEach(element => {
//     trx.store.add(element);
//   });

//   trx.done.then(() => console.log('all data inserted'))
//   .catch(err => console.log('Transaction aborted. ', err));
  
//   db.close();
// }

// //retrieve data
// export const getData = async () => {
//   const db = await openDB(DATABASE_NAME, DATABASE_VERSION);
//   return db.getAll(storeName)
//   // .then(result => {
//   //   return result;
//   // })
//   // .catch(err => console.log(err))
//   // db.close();
// }





// // dbPromise.then(function(db) {
// //   let tx = db.transaction(storeName, 'readwrite');
// //   let store = tx.objectStore(storeName);


// //   return Promise.all(items.map((item) => {
// //     console.log('Adding album:', item);
// //     return store.add(item);
// //   }))
// // }).catch((e) => {
// //   console.log(e);
// // })