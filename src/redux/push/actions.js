import * as types from './actionTypes';
import pushHelper from '../../utils/pushHelper';

export function setPushOnState(isPushOn) {
  return { type: types.TOGGLE_PUSH_ON, payload: isPushOn };
}

export function setPushRegistrationComplete(isRegistrationComplete) {
  return {
    type: types.TOGGLE_IS_PUSH_SETUP_COMPLETE,
    payload: isRegistrationComplete,
  };
}

export function failedToSetPushState(message) {
  return { type: types.FAILED_TO_SET_PUSH_STATE, payload: message };
}

export function Signoff() {
  return async () => {
    try {
      pushHelper.Signoff();
    } catch (error) {
      // Catch this
    }
  };
}

export function togglePush(toggleOn, os) {
  return async (dispatch) => {
    try {
      await pushHelper.togglePush(toggleOn, os);
      dispatch(setPushOnState(toggleOn));

      const isPushRegistrationComplete =
        await pushHelper.IsPushRegistrationComplete();
      dispatch(setPushRegistrationComplete(isPushRegistrationComplete));
    } catch (error) {
      dispatch(
        setPushOnState('Misslyckades med att sätta ny meddelande inställning'),
      );
    }
  };
}

export function getNotificationReceivedPayload(notification) {
  return { type: types.NOTIFICATION_RECEIVED, payload: notification };
}
export function getNotificationOpenedPayload(notification) {
  return { type: types.NOTIFICATION_OPENED, payload: notification };
}

export function onNotificationReceived(notification) {
  return async (dispatch) => {
    dispatch(getNotificationReceivedPayload(notification.data));
  };
}

export function onNotificationOpened(notification) {
  return async (dispatch) => {
    dispatch(getNotificationOpenedPayload(notification.data));
  };
}

export function setPlatformPushTokenAsync(platformHandle, platform) {
  return async () => {
    await pushHelper.setPlatformPushTokenAsync(platformHandle, platform);
  };
}

export function setPushHandle(handle) {
  return async () => {
    await pushHelper.SavePushToken(handle);
  };
}

export function CheckForAndRegisterPush(os) {
  return async () => {
    pushHelper.CheckForAndRegisterPush(os);
  };
}

export function getLatestRegInfoPayload(latestInfo) {
  return { type: types.LATEST_PUSH_REG_INFO, payload: latestInfo };
}

export function refreshLatestInfo() {
  return async (dispatch) => {
    const lastVal = await pushHelper.GetLastRegInfo();
    dispatch(getLatestRegInfoPayload(lastVal !== null ? lastVal : 'no value'));
  };
}

export function pushInitialized() {
  return async (dispatch) => {
    const isPushOn = await pushHelper.IsPushOn();
    const isPushRegistrationComplete = await pushHelper.IsPushRegistrationComplete();
    dispatch(setPushOnState(isPushOn));
    dispatch(setPushRegistrationComplete(isPushRegistrationComplete));
  };
}
