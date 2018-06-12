import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  currentlyRetrievingValue: false,
  retrievalError: '',
  userLogEntries: [],
  foodList: [],
});

export default function bloodsugar(state = initialState, action = {}) {
  switch (action.type) {
    case types.RETRIEVE_USER_LOG_STARTED:
      return {
        ...state,
        currentlyRetrievingValue: true,
      };
    case types.RETRIEVE_USER_LOG_ERROR:
      return {
        ...state,
        retrievalError: action.payload,
        currentlyRetrievingValue: false,
      };
    case types.RETRIEVE_USER_LOG_COMPLETED:
      return {
        ...state,
        retrievalError: '',
        currentlyRetrievingValue: false,
      };
    case types.ADD_TO_USER_LOG:
      return {
        ...state,
        userLogEntries: [action.payload, ...state.userLogEntries],
      };
    case types.SET_USER_LOG:
      return {
        ...state,
        userLogEntries: action.payload,
        retrievalError: '',
        currentlyRetrievingValue: false,
      };
    case types.CLEAR_USER_LOG:
      return {
        ...state,
        userLogEntries: [],
        retrievalError: '',
        currentlyRetrievingValue: false,
      };
    case types.MEAL_LOADED:
      return {
        ...state,
        foodList: action.payload,
      };
    case types.MEAL_CLEARED:
      return {
        ...state,
        foodList: [],
      };
    default:
      return state;
  }
}
