//for test
//const HOST = "http://52.79.240.67:3000";
// const APIS = {
//   GET_CODE: {
//     url: "/code",
//     method: "GET"
//   },
//   GET_CODE_CATEGORY: {
//     url: "/code_category",
//     method: "GET"
//   },
//   // GET /center
//   GET_CENTER: {
//     url: "/center",
//     method: "GET"
//   },
//   // GET /user/email/{email}
//   GET_USER_BY_EMAIL: {
//     url: "/k_user_email",
//     // url: "/user/email",
//     method: "GET"
//   },
//   // PUT /user/phone/{userPhone}
//   PUT_USER_BY_PHONE: {
//     url: "/k_user_email",
//     // url: "/user/phone",
//     method: "PUT"
//   },
//   // PUT /user
//   PUT_USER: {
//     url: "/k_user_email",
//     // url: "/user",
//     method: "PUT"
//   },
//   // POST /user
//   POST_USER: {
//     url: "/k_user_email",
//     method: "POST"
//   },
//   // GET /child/parent/{user_id}/{date}
//   GET_CHILD_PARENT_BY_UID_AND_DATE: {
//     // url: "/k_child_parent/1",
//     url: "/child/parent",
//     method: "GET"
//   },
//   // GET /child/teacher/{user_id}/{date}
//   GET_CHILD_TEACHER_BY_UID_AND_DATE: {
//     // url: "/k_child_parent/1",
//     url: "/child/teacher",
//     method: "GET"
//   },
//   // GET /child/center/{center_id}
//   GET_CHILD_BY_CENTER_ID: {
//     // url: "/k_child_center",
//     url: "/child/center",
//     method: "GET"
//   },
//   // PUT /child/event_check
//   POST_CHILD_EVENT: {
//     // url: "/k_child_event/",
//     url: "/child/event_check",
//     method: "POST"
//   }
// };

const APIS = {
  GET_CODE: {
    url: "/code",
    method: "GET"
  },
  GET_CODE_CATEGORY: {
    url: "/code_category",
    method: "GET"
  },
  GET_CENTER: {
    url: "/center",
    method: "GET"
  },
  GET_USER_BY_EMAIL: {
    url: "/user/email",
    method: "GET"
  },
  PUT_USER_BY_PHONE: {
    url: "/user/phone",
    method: "PUT"
  },
  PUT_USER: {
    url: "/user",
    method: "PUT"
  },
  POST_USER: {
    url: "/user",
    method: "POST"
  },
  GET_CHILD_PARENT_BY_UID_AND_DATE: {
    url: "/child/parent",
    method: "GET"
  },
  GET_CHILD_TEACHER_BY_UID_AND_DATE: {
    url: "/child/teacher",
    method: "GET"
  },
  GET_CHILD_BY_CENTER_ID: {
    url: "/child/center",
    method: "GET"
  },
  POST_CHILD_EVENT: {
    url: "/child/event_check",
    method: "POST"
  }
};
export default APIS;
