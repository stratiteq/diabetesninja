import { AsyncStorage } from 'react-native';
import moment from 'moment';
import ninjatokenparser from '../../utils/ninjatokenparser';
import * as storageKeys from '../../constants/storageKeys';
import * as logTypes from '../../constants/logTypes';

import * as types from './actionTypes';
import * as userLogTypes from '../userlog/actionTypes';

import Api from '../../utils/api';
import toastMessage from '../../utils/ToastMessage';

export function addCarbToMeal(mealInfo) {
  return async (dispatch) => {
    // eslint-disable-next-line no-param-reassign
    mealInfo.key = `${mealInfo.foodId.toString()}_${moment(new Date()).format(
      'DDHHmmss',
    )}`;

    dispatch({ type: types.CARB_ADDED_TO_MEAL, payload: mealInfo });
  };
}

export function removeCarbFromMeal(mealId) {
  return async (dispatch) => {
    dispatch({ type: types.REMOVE_FOOD_FROM_MEAL, payload: mealId });
  };
}

export function submitMeal(mealInfo) {
  return async (dispatch) => {
    dispatch({ type: types.UPDATE_MEAL_SAVE_STARTED });

    const detailRows = mealInfo.mealDetails.map(data => ({
      foodId: parseInt(data.foodId, 10),
      foodGroupId: data.foodGroupId,
      foodName: data.name,
      foodGroupName: data.foodGroupName,
      unitDesc: data.qtyUnit,
      mealDetailCarb: data.carbEquivalent,
      qty: data.qty,
    }));

    const userIdFromStorage = await AsyncStorage.getItem(
      storageKeys.SELECTED_USER_ID,
    );

    const bodySubmit = {
      logType: logTypes.LOGTYPE_CARBONHYDRATE,
      userId: userIdFromStorage,
      carbonHydrates: Math.ceil(mealInfo.carbSum),
      mealDetails: detailRows,
    };

    Api.post('userLog', {
      headers: {
        Authorization: `Bearer ${await ninjatokenparser.getBearerTokenFromStorageAsync()}`,
      },
      body: bodySubmit,
    })
      .then((response) => {
        const logToAdd = {
          id: response.userLogId,
          date: moment(response.createdDate).toDate(),
          logType: response.logType,
          value: response.carbonHydrates,
        };

        dispatch({ type: userLogTypes.ADD_TO_USER_LOG, payload: logToAdd });
        dispatch({ type: types.CLEAR_TEMP_MEAL_LIST, payload: null });
        toastMessage.showInfoMessage(
          `Måltid har sparats som ${response.carbonHydrates} KH`,
        );
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          dispatch({
            type: types.UPDATE_MEAL_SAVE_ERROR,
            payload: {
              successFlag: false,
              errorMsg: 'Misslyckades att spara måltid, obehörig',
            },
          });
          toastMessage.showErrorMessage(
            'Misslyckades att spara måltid, obehörig',
          );
          return;
        }

        dispatch({
          type: types.UPDATE_MEAL_SAVE_ERROR,
          payload: {
            successFlag: false,
            errorMsg: 'Misslyckades med att spara måltid, testa igen.',
          },
        });
        toastMessage.showErrorMessage(
          'Misslyckades med att spara måltid, testa igen.',
        );
      });
  };
}
