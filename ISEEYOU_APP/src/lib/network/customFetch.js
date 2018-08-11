// const HOST = "http://14.63.106.109:43000";
// const HOST = "http://52.79.240.67:3000";
const HOST = "http://52.79.240.67:8080/banggm";
// const HOST = "http://220.74.55.61:8081";

//const HOST = "http://13.125.124.29:8080/test";
//const HOST = "http://14.63.106.109:48080/fitdiaryAppBackend";
//const API = "http://10.0.0.2:3000";
const headers = new Headers({
  "x-requested-with": "XMLHttpRequest",
  accept: "application/json; charset=utf-8",
  "Content-Type": "application/json; charset=utf-8",
  mode: "same-origin",
  credentials: "same-origin"
});
const timeoutms = 10000;
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject({
        type: "requestTimeout",
        status: "timeout",
        message: "서버 요청 시간을 " + timeoutms / 1000 + "초를 초과했습니다."
      });
    }, ms);
    promise.then(resolve, reject);
  });
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
const cFetch = (API, params, body, fncs) => {
  let url = API.url;
  let method = API.method;
  for (var i in params) {
    url += "/" + params[i];
  }
  console.log(method + " " + HOST + url, body);
  timeout(
    timeoutms,
    fetch(`${HOST}` + url, {
      method: method,
      //웹이 아니라 CORS개념이 없다.
      //mode: "same-origin",
      //credentials: "same-origin",
      headers: headers,
      body: method != "GET" && body != undefined ? body : undefined
    })
  )
    //response의 ok가 true이고, status가 200인지 체크
    .then(async res => {
      // console.log("responseCheck");
      if (fncs.responseCheck == undefined) {
        if (!res.ok) {
          //throw Error(e); //throw Error대신 throw Object
          if (fncs.responseNotFound == undefined) {
            throw {
              type: "responseCheckError",
              status: res.status,
              message: res.statusText
            };
          } else {
            await fncs.responseNotFound(res);
          }
        }
        return res.json();
      } else {
        return await fncs.responseCheck(res);
      }
    })
    //response의 데이터 code가 200인지 체크
    .then(async res => {
      // console.log("responseProc");
      // console.log(res);
      //앞에서는 request가 백엔드서버가기전까지 체크, 지금은 requeset가 백엔드 서버에 도착.  : code, message가 있음.
      if (res.code != undefined && res.message != undefined) {
        if (res.code == 200) {
          if (fncs.responseProc) {
            await fncs.responseProc(res.data);
          }
        } else {
          // console.log(res.code);
          if (fncs.responseNotFound) {
            await fncs.responseNotFound(res.data);
          } else {
            throw {
              type: "responseProcError",
              status: res.code,
              message: res.message
            };
          }
        }
      } else {
        if (fncs.responseProc && !isEmpty(res)) {
          await fncs.responseProc(res);
        }
      }
    })
    .catch(async e => {
      // console.log("catch error");
      //error event객체: type, status, message
      if (fncs.responseError == undefined) {
        // console.log(e);
        let message = "에러가 발생했습니다.";
        message += e.type ? "\nTYPE: " + e.type : "";
        message += e.status ? "\nCODE: " + e.status : "";
        message += e.message ? "\nMESSAGE: " + e.message : "";
        message += e.name ? "\nNAME: " + e.name : "";
        alert(message);
      } else {
        await fncs.responseError(e);
      }
    });
  // fetch(`${HOST}` + url, {
  //   //method: opts.method,
  //   method: method,
  //   //웹이 아니라 CORS개념이 없다.
  //   //mode: "same-origin",
  //   //credentials: "same-origin",
  //   headers: headers
  // })
  //   //response의 ok가 true이고, status가 200인지 체크
  //   .then(res => {
  //     console.log("responseCheck");
  //     if (fncs.responseCheck == undefined) {
  //       if (!res.ok) {
  //         //throw Error(e); //throw Error대신 throw Object
  //         throw {
  //           type: "responseCheckError",
  //           status: res.status,
  //           message: res.statusText
  //         };
  //       }
  //       return res.json();
  //     } else {
  //       return fncs.responseCheck(res);
  //     }
  //   })
  //   //response의 데이터 code가 200인지 체크
  //   .then(res => {
  //     console.log("responseProc");
  //     console.log(res);
  //     //실제 백엔드 개발서버 : code, message가 있음.
  //     if (res.code != undefined && res.message != undefined) {
  //       if (res.code == 200) {
  //         fncs.responseProc(res);
  //       } else {
  //         // throw Error("(code:" + res.code + ") " + res.message);
  //         throw {
  //           type: "responseProcError",
  //           status: res.code,
  //           message: res.message
  //         };
  //       }
  //     } else {
  //       fncs.responseProc(res);
  //     }
  //   })
  //   .catch(e => {
  //     console.log("catch error");
  //     //error event객체: type, status, message
  //     if (fncs.responseError == undefined) {
  //       console.log(e);
  //       let message = "에러가 발생했습니다.";
  //       message += e.type ? "\nTYPE: " + e.type : "";
  //       message += e.status ? "\nCODE: " + e.status : "";
  //       message += e.message ? "\nMESSAGE: " + e.message : "";
  //       message += e.name ? "\nNAME: " + e.name : "";
  //       alert(message);
  //     } else {
  //       fncs.responseError(e);
  //     }
  //   })
};
export default cFetch;
