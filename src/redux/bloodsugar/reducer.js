import Immutable from "seamless-immutable";
import * as types from "./actionTypes";

const initialState = Immutable({
  currentlyLoggingValue: false,
  lastValue: null
});

export default function bloodsugar(state = initialState, action = {}) {
  switch (action.type) {
    case types.BLOODSUGAR_STARTED:
      return {
        ...state,
        currentlyLoggingValue: true
      };
    case types.BLOODSUGAR_UPDATED:
      return {
        ...state,
        lastValue: action.payload,
        currentlyLoggingValue: false
      };
    case types.BLOODSUGAR_ERROR:
      return {
        ...state,
        currentlyLoggingValue: false
      };
    case types.BLOODSUGAR_CLEAR:
      return {
        ...state,
        currentlyLoggingValue: false,
        lastValue: null
      };
    default:
      return state;
  }
}
