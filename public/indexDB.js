const request = window.indexedDB.open("budgetDB", 1);
let db;

request.onsuccess = (event) => {
  console.log(request.result.name);
  db = event.target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDataBase();
  }
};

request.onupgradeneeded = (event) => {
  // create object store called "pending" and set autoIncrement to true
   db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = (event) => {
//console.log('error: ' event.target.errorcode);
console.log('error encountered');
};

function saveRecord(exchange) {
    let transaction = db.transaction(["pending"], "readwrite");
    let store = transaction.objectstore("pending");
    store.add(exchange);
} 
 

function checkDataBase() {
  let transaction = db.transaction(["pending"], "readwrite");
  let store = transaction.objectstore("pending");
  const getAllRequests = store.getAll();
  getAllRequest.onsuccess = function () {
    if (getAllRequest.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAllRequest.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["pending"], "readwrite");
          // access your pending object store
          const store = transaction.objectStore("pending");
          // clear all items in your store
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDataBase);