const workercode = () => {
  onmessage = function (e) {
    console.log("Message received from main script");
    console.log(e);
    var workerResult = e.data.name;
    console.log("Posting message back to main script");
    postMessage(workerResult);
  };
};

export default workercode;

// let code = workercode.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
// const blob = new Blob([code], { type: "application/javascript" });
// const worker_script = URL.createObjectURL(blob);

// module.exports = worker_script;
