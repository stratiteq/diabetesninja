import * as storageKeys from "../constants/storageKeys";
import { AsyncStorage } from "react-native";
import Api from "./api";
import ninjaTokenParser from "./ninjatokenparser";
import Platform from "react-native";
import moment from "moment";

class pushHelper {
  static async setPlatformPushTokenAsync(token, os) {
     console.log("on set platform start" + token);
    try {
      const prevVal = await AsyncStorage.getItem(storageKeys.PLATFORM_PUSH_TOKEN);

      const notHubSavedVal = await AsyncStorage.getItem(
        storageKeys.NOTIFICATION_HUB_REGISTRATION
      );

      const isPushOn = await this.IsPushOn();

      //According to Björn always update token
      await AsyncStorage.setItem(storageKeys.PLATFORM_PUSH_TOKEN, token);

      if (isPushOn) await this.updateNotificationHubAsync(token, os); // If push is on, register in Notification Hub

    } catch (error) {
      // console.log(`error saving platformToken : ${error}`);
    }
  }

  static async updateNotificationHubAsync(token, os) {
    try {
      let notHubReg = await AsyncStorage.getItem(
        storageKeys.NOTIFICATION_HUB_REGISTRATION
      );

      const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

      if (notHubReg === null || notHubReg === undefined) {
        notHubReg = await this.getNotificationHubRegistrationAsync(); // Should be in if above
      }

      //console.log(`gonna update notification hub with ${notHubReg}`);

      let platformId = os === "ios" ? 2 : 3; // default Ios

      Api.put(`Push/${notHubReg}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        },
        noBody: true,
        body: {
          platform: platformId,
          platformNotificationServiceHandle: token
        }
      })
        .then(async response => {
           await AsyncStorage.setItem(
            storageKeys.LATEST_PUSH_SAVE_INFO,
            `Senaste registrering OK ${moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )}. Not hub ${notHubReg}, platformToken: ${token}
            )}`
          );
          //console.log("done with put (token update)");
        })
        .catch(error => {
          //console.log("error in put notification hub");
        });
    } catch (error) {
      // TODO: Dispatch... console.log(`error saving platformToken : ${error}`);
    }
  }

  static async GetLastRegInfo() {
    const value = await AsyncStorage.getItem(storageKeys.LATEST_PUSH_SAVE_INFO);
    return value;
  }

  static async getNotificationHubRegistrationAsync() {
    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    // console.log("1. in get notification hub id");

    return Api.post(`Push`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      body: {}
    })
      .then(async response => {
        //  console.log(`2. not hub response ${response}`);

        await AsyncStorage.setItem(
          storageKeys.NOTIFICATION_HUB_REGISTRATION,
          response
        );
        // console.log(`3. not hub returning ${response}`);
        return response;
      })
      .catch(error => {
        // console.log(`4. Failed to get notification hub identifier${error}`);
        throw error;
      });
  }

  static async togglePush(toggleOn, os) {
    const isPushOffStored = await AsyncStorage.getItem(storageKeys.IS_PUSH_OFF);

    const platFormToken = await AsyncStorage.getItem(storageKeys.PLATFORM_PUSH_TOKEN);
    //console.log("pt: " + platFormToken);

    if (toggleOn && isPushOffStored !== null) {
      //console.log("remove IS_PUSH_OFF flag");
      await AsyncStorage.removeItem(storageKeys.IS_PUSH_OFF);
    }

    if (toggleOn) {
      //console.log("Register with: " + platFormToken);
      await this.updateNotificationHubAsync(platFormToken, os);
    }

    if (!toggleOn) {
      //console.log("toggle off");
      await this.UnregisterPushAsync();
      await AsyncStorage.setItem(storageKeys.IS_PUSH_OFF, "true");
    }
  }

  static async Signoff() {
    if (this.IsPushOn && this.IsPushRegistrationComplete) {
      //console.log("Logging off");
      await this.UnregisterPushAsync();
    }
  }

  static async IsPushOn() {
    const isPushOff = await AsyncStorage.getItem(storageKeys.IS_PUSH_OFF);

    // console.log(`Check is push off: ${isPushOff}`);

    if (isPushOff !== null) return false;

    return true;
  }

  static async SavePushToken(token) {
    //console.log("Save token " + token)
    await AsyncStorage.setItem(storageKeys.NEW_PLATFORM_PUSH_TOKEN, token);
    //console.log("after Save token " + token)
  }

  static async CheckForAndRegisterPush(os) {
    const newPlatformToken = await AsyncStorage.getItem(
      storageKeys.NEW_PLATFORM_PUSH_TOKEN
    );
    //console.log("new token: " + newPlatformToken);
    if (newPlatformToken !== null) {
      //console.log("gonna update token " + newPlatformToken);
      await this.setPlatformPushTokenAsync(newPlatformToken, os);
      await AsyncStorage.removeItem(storageKeys.NEW_PLATFORM_PUSH_TOKEN);
    }
  }

  static async IsPushRegistrationComplete() {
    const isPushOff = await AsyncStorage.getItem(storageKeys.IS_PUSH_OFF);
    const notHubReg = await AsyncStorage.getItem(
      storageKeys.NOTIFICATION_HUB_REGISTRATION
    );
    const platformReg = await AsyncStorage.getItem(
      storageKeys.PLATFORM_PUSH_TOKEN
    );

    if (
      isPushOff !== null &&
      (platformReg !== null && platformReg.length > 0) &&
      (notHubReg !== null && notHubReg.length > 0)
    )
      return true; // Correct Non Push config

    if (
      isPushOff === null &&
      (platformReg !== null && platformReg.length > 0) &&
      (notHubReg !== null && notHubReg.length > 0)
    )
      return true; // Correct Push config

    return false;
  }

  static async UnregisterPushAsync() {
    const notHubReg = await AsyncStorage.getItem(
      storageKeys.NOTIFICATION_HUB_REGISTRATION
    );

    const bearerToken = await ninjaTokenParser.getBearerTokenFromStorageAsync();

    if (notHubReg !== null)
      Api.delete(`Push/${notHubReg}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        },
        noBody: true,
        body: {}
      })
        .then(async response => {
          const oldPlatformToken = await AsyncStorage.getItem(
            storageKeys.PLATFORM_PUSH_TOKEN
          );

          if (oldPlatformToken !== null) {
            await AsyncStorage.setItem(
              storageKeys.NEW_PLATFORM_PUSH_TOKEN,
              oldPlatformToken
            ); // Will reenable push after signin
          }

          await AsyncStorage.removeItem(
            storageKeys.NOTIFICATION_HUB_REGISTRATION
          );

          //console.log(`Push removed ok`);
          return true;
        })
        .catch(error => {
          // console.log(
          //   `Failed to delete get notification hub identifier${error}`
          // );
          throw error;
        });
  }

  static async clearAllLocalregistration() {
    await AsyncStorage.removeItem(storageKeys.NOTIFICATION_HUB_REGISTRATION);
    await AsyncStorage.removeItem(storageKeys.PLATFORM_PUSH_TOKEN);
    await AsyncStorage.removeItem(storageKeys.IS_PUSH_OFF);

    // console.log("Data cleared");
  }
}

export default pushHelper;
