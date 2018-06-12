import moment from 'moment';
import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  currentlyRetrievingValue: false,
  retrievalError: '',
  externalDataEntries: [],
  externalDataLastTimeStamp: moment(new Date())
    .add(-1, 'day')
    .format('YYYY-MM-DDTHH:mm:ss'),
  currentlyConnectingToDexcom: false,
  dexComError: '',
  currentlyDisConnectingFromDexcom: false,
  dexComDisconnectError: '',
  lastExternalValue: null,
});

function getTimeStamp(arrayOfData) {
  let lastTimeStamp;
  if (!arrayOfData || arrayOfData.length === 0) {
    lastTimeStamp = moment(new Date())
      .add(-1, 'day')
      .format('YYYY-MM-DDTHH:mm:ss');
  } else {
    lastTimeStamp = arrayOfData[0].date;
  }

  return lastTimeStamp;
}

function getLastValue(arrayOfData) {
  let lastValue;
  if (!arrayOfData || arrayOfData.length === 0) lastValue = null;
  else [lastValue] = arrayOfData;

  return lastValue;
}

export default function externalUserData(state = initialState, action = {}) {
  switch (action.type) {
    case types.RETRIEVE_EXTERNAL_DATA_STARTED:
      return {
        ...state,
        currentlyRetrievingValue: true,
      };
    case types.RETRIEVE_EXTERNAL_DATA_ERROR:
      return {
        ...state,
        retrievalError: action.payload,
        currentlyRetrievingValue: false,
      };
    case types.RETRIEVE_EXTERNAL_DATA_DONE:
      return {
        ...state,
        retrievalError: '',
        currentlyRetrievingValue: false,
      };
    case types.ADD_TO_EXTERNAL_DATA:
      return {
        ...state,
        externalDataEntries: [...action.payload, ...state.externalDataEntries],
        externalDataLastTimeStamp: getTimeStamp(action.payload),
        currentlyRetrievingValue: false,
        lastExternalValue: getLastValue(action.payload),
      };
    case types.SET_EXTERNAL_DATA:
      return {
        ...state,
        externalDataEntries: action.payload,
        retrievalError: '',
        externalDataLastTimeStamp: getTimeStamp(action.payload),
        currentlyRetrievingValue: false,
        lastExternalValue: getLastValue(action.payload),
      };
    case types.CLEAR_EXTERNAL_DATA:
      return {
        ...state,
        externalDataEntries: [],
        retrievalError: '',
        externalDataLastTimeStamp: moment(new Date())
          .add(-1, 'day')
          .format('YYYY-MM-DDTHH:mm:ss'),
        lastExternalValue: null,
        currentlyRetrievingValue: false,
      };
    case types.DEXCOM_REGISTRATION_STARTED:
      return {
        ...state,
        currentlyConnectingToDexcom: true,
        dexComError: '',
      };
    case types.DEXCOM_REGISTRATION_COMPLETED:
      return {
        ...state,
        currentlyConnectingToDexcom: false,
        dexComError: '',
      };
    case types.DEXCOM_REGISTRATION_ERROR:
      return {
        ...state,
        currentlyConnectingToDexcom: false,
        dexComError: action.payload,
      };
    case types.DEXCOM_DISCONNECT_STARTED:
      return {
        ...state,
        currentlyDisConnectingFromDexcom: true,
        dexComDisconnectError: '',
      };
    case types.DEXCOM_DISCONNECT_COMPLETED:
      return {
        ...state,
        currentlyDisConnectingFromDexcom: false,
        dexComDisconnectError: '',
      };
    case types.DEXCOM_DISCONNECT_ERROR:
      return {
        ...state,
        currentlyDisConnectingFromDexcom: false,
        dexComDisconnectError: action.payload,
      };
    default:
      return state;
  }
}
