import { logger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import thunk from "redux-thunk";
import * as reducers from "./redux";
import * as appActions from "./redux/app/actions";
import { registerScreens } from "./screens";

// redux related book keeping
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// screen related book keeping
registerScreens(store, Provider);

// notice that this is just a simple class, it's not a React component
export default class App {
  constructor() {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(appActions.appInitialized());
    store.dispatch(appActions.platformInitialized("ios"));
  }

  onStoreUpdate() {
    try {
      const { root } = store.getState().app;
      // handle a root change
      // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
      if (this.currentRoot !== root) {
        this.currentRoot = root;
        this.startApp(root);
      }
    }
    catch (errrr) { }
  }

  startApp(root) {
    switch (root) {
      case "login":
        Navigation.startSingleScreenApp({
          screen: {
            screen: "diabetesNinja.LoginScreen",
            title: "DiabetesNinja",
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
            title: "DiabetesNinja",
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
        console.error(`Unknown app root ${root}`);
    }
  }
}
