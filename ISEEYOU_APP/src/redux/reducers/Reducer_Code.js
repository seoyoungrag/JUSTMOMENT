import types from "../actions/Types_Code";

const codeCategory = [];
const code = [];

export default (state = { code, codeCategory }, action) => {
  switch (action.type) {
    case types.SET_CODE_CATEGORY:
      return {
        ...state,
        codeCategory: action.payload
      };
    case types.SET_CODE:
      return {
        ...state,
        code: action.payload
      };
    default:
      return state;
  }
};
