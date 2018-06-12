import { logger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import { NotificationsAndroid } from "react-native-notifications";
import thunk from "redux-thunk";
import * as reducers from "./redux";
import * as appActions from "./redux/app/actions";
import * as pushActions from "./redux/push/actions"; // For initialization only
import { registerScreens } from "./screens";

// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// It's highly recommended to keep listeners registration at global scope rather than at screen-scope seeing that
// component mount and unmount lifecycle tend to be asymmetric!
function onPushRegistered(data) {
  store.dispatch(pushActions.setPushHandle(data));
}
NotificationsAndroid.setRegistrationTokenUpdateListener(onPushRegistered);

// screen related book keeping
registerScreens(store, Provider);

// notice that this is just a simple class, it's not a React component
export default class AppAndroid {
  constructor() {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));

    store.dispatch(appActions.appInitialized());
    store.dispatch(pushActions.pushInitialized());
    store.dispatch(appActions.platformInitialized("android"));
  }

  onStoreUpdate() {
    try {
      const { root } = store.getState().app;
      //console.log(`Android version${root}`);

      if (this.currentRoot !== root) {
        this.currentRoot = root;
        this.startApp(root);
      }
    } catch (errrr) {
      //console.log(errrr);
    }
  }

  startApp(root) {
    switch (root) {
      case "login":
        Navigation.startSingleScreenApp({
          screen: {
            screen: "diabetesNinja.LoginScreen",
            title: "Diabetes Ninja",
            navigatorStyle: {}
          },
          passProps: {},
          appStyle: {
            orientation: "portrait"
          }
        });

        return;
      case "loggedIn":
        Navigation.startSingleScreenApp({
          screen: {
            screen: "diabetesNinja.DashboardScreen",
            title: "Diabetes Ninja",
            navigatorStyle: {}
          },
          drawer: {
            left: {
              screen: "diabetesNinja.SideBar",
              passProps: {},
              disableOpenGesture: false
            }
          },
          passProps: {},
          appStyle: {
            orientation: "portrait"
          }
        });
        return;
      default:
        //console.error(`Unknown app root ${root}`);
    }
  }
}
