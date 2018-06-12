import * as storageKeys from "../constants/storageKeys";
import { AsyncStorage } from "react-native";
import moment from "moment";

class ninjatokenparser {
  static async getBearerTokenFromStorageAsync() {
    try {
      const storedAccessToken = await AsyncStorage.getItem(
        storageKeys.TOKEN_BEARER
      );

      if (storedAccessToken !== null) return storedAccessToken;
      return null;
    } catch (ex) {
      return null;
    }
  }

  static async getRefreshTokenFromStorageAsync() {
    try {
      const storedAccessToken = await AsyncStorage.getItem(
        storageKeys.TOKEN_REFRESH
      );

      if (storedAccessToken !== null) return storedAccessToken;
      return null;
    } catch (ex) {
      return null;
    }
  }

  static async saveAccessToken(tokenInfo) {
    try {
      await AsyncStorage.setItem(
        storageKeys.TOKEN_REFRESH,
        tokenInfo.refresh_token
      );

      await AsyncStorage.setItem(
        storageKeys.TOKEN_EXPIRATION,
        tokenInfo.expires_in
      );

      await AsyncStorage.setItem(
        storageKeys.TOKEN_BEARER,
        tokenInfo.access_token
      );
      return null;
    } catch (error) {
      return null;
    }
  }

  static async getTokenFromStorageAsync() {
    try {
      const storedRefreshToken = await AsyncStorage.getItem(
        storageKeys.TOKEN_REFRESH
      );
      const storedAccessToken = await AsyncStorage.getItem(
        storageKeys.TOKEN_BEARER
      );
      const storedExpiresIn = await AsyncStorage.getItem(
        storageKeys.TOKEN_EXPIRATION
      );

      if (
        storedRefreshToken !== null &&
        moment(storedExpiresIn) > moment(new Date())
      )
        return {
          access_token: storedAccessToken,
          expires_in: storedExpiresIn,
          refresh_token: storedRefreshToken
        };
      return null;
    } catch (ex) {
      return null;
    }
  }

  static parseGrant(grantUserData) {
    const splitData = grantUserData.split(":");
    return {
      GrantUserId: splitData[1],
      GrantUserFirstName: splitData[0],
      GrantUserDevice: splitData.length >= 3 ? splitData[2] : "None"
    };
  }

  static parseJwt(token) {
    const NameClaim =
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
    const UserIdClaim =
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const UserDataClaim =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata";
    const DeviceClaim = "UserDevice";

    try {
      const jwtDecode = require("jwt-decode");
      const parsedToken = jwtDecode(token);

      //console.log(parsedToken);

      const grantData = parsedToken[UserDataClaim];
      let grants = [];
      if (grantData == null) {
        // No grants
        //console.log("no grants found, nothing to add");
      } else if (Array.isArray(grantData)) {
        // Array of grants
        //console.log("multiple grants found");

        grantData.forEach(tempGrant => {
          grants.push(this.parseGrant(tempGrant));
        });
      } else {
        // single grant
        //console.log("single grants found");
        grants = [this.parseGrant(grantData)];
      }

      const ownDevice =
        parsedToken[DeviceClaim] === undefined
          ? "None"
          : parsedToken[DeviceClaim];

      const user = {
        FirstName: parsedToken[NameClaim],
        UserId: parsedToken[UserIdClaim],
        UserDevice: ownDevice,
        Granted: grants
      };

      //console.log("parsed token data");

      //console.log(user);

      return user;
    } catch (e) {
      return null;
    }
  }
}

export default ninjatokenparser;
