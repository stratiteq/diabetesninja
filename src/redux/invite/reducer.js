import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const initialState = Immutable({
  invitationCode: -1,
  loading: false,
  error: null,
  loadingFollowers: false,
  followers: [],
  followersError: null,
  removingFollower: false,
  removeFollowerError: null,
});

export default function invite(state = initialState, action = {}) {
  switch (action.type) {
    case types.INVITATION_CODE_STARTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.IVNITATION_CODE_DONE:
      return {
        ...state,
        loading: false,
        error: null,
        invitationCode: action.payload,
      };
    case types.INVITATION_CODE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.INVITATION_GET_FOLOWERS_STARTED:
      return {
        ...state,
        loadingFollowers: true,
        followersError: null,
        followers: [],
      };
    case types.INVITATION_GET_FOLLOWERS_DONE:
      return {
        ...state,
        loadingFollowers: false,
        error: null,
        followers: action.payload,
      };
    case types.INVITATION_GET_FOLLOWERS_ERROR:
      return {
        ...state,
        loadingFollowers: false,
        followersError: action.payload,
        followers: [],
      };
    case types.INVITATION_REMOVE_FOLOWER_STARTED:
      return {
        ...state,
        removingFollower: true,
      };
    case types.INVITATION_REMOVE_FOLLOWER_DONE:
      return {
        ...state,
        removingFollower: true,
      };
    case types.INVITATION_REMOVE_FOLLOWER_ERROR:
      return {
        ...state,
        removeFollowerError: action.payload,
      };
    default:
      return state;
  }
}
