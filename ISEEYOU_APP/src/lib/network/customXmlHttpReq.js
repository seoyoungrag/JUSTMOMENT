const API = "http://14.63.106.109:43000";
//const API = "http://10.0.0.2:3000";
// let headers = new Headers({
//   "x-requested-with": "XMLHttpRequest",
//   accept: "application/json; charset=utf-8",
//   "Content-Type": "application/json; charset=utf-8",
//   mode: "same-origin",
//   credentials: "same-origin"
// });
let headers = [
  { "x-requested-with": "XMLHttpRequest" },
  { accept: "application/json; charset=utf-8" },
  { "Content-Type": "application/json; charset=utf-8" },
  { mode: "same-origin" },
  { credentials: "same-origin" }
];

function updateProgress(oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    // ...
  } else {
    // Unable to compute progress information since the total size is unknown
  }
}
function transferComplete(evt) {
  console.log(evt);
  console.log("The transfer is complete.");
}

function transferFailed(evt) {
  alert("에러가 발생했습니다.");
  console.log(evt);
}

function transferCanceled(evt) {
  alert("전송이 취소되었습니다.");
  console.log(evt);
}
const cFetch = (url, opts, onProgress) => {
  url = API + url;
  console.log(url, opts);
  return new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("load", transferComplete);
    xhr.addEventListener("error", transferFailed);
    xhr.addEventListener("abort", transferCanceled);
    xhr.open(opts.method || "get", url);
    for (var k in headers || {}) {
      xhr.setRequestHeader(k, headers[k]);
    }
    // for (var k in opts.headers || {}) {
    //   xhr.setRequestHeader(k, opts.headers[k]);
    // }
    xhr.onload = e => res(e.target);
    xhr.onerror = rej;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
};
export default cFetch;
