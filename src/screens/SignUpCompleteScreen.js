import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isIphoneX } from "react-native-iphone-x-helper";

import * as applicationActions from "../redux/app/actions";
import * as commonCss from "../styles/CommonStyles";
import * as navigatorStyles from "../styles/NavigatorStyles";

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  createText: {
    fontWeight: "bold",

    textAlign: "center",
    color: "#FFFFFF"
  },
  loginText: {
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: "#FFFFFF"
  },
  instructions: {
    textAlign: "center",
    color: "#D9FFFFFF",
    marginBottom: 5
  }
});

class SignUpCompleteScreen extends Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    navBarHidden: true,
    drawUnderNavBar: true
  };

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      imageHeight: new Animated.Value(isIphoneX() ? 250 : 200)
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this._keyboardDidShow()
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this._keyboardDidHide()
    );
  }

  _keyboardDidHide() {
    this.animate(isIphoneX() ? 250 : 200);
  }

  _keyboardDidShow() {
    this.animate(isIphoneX() ? 30 : 0);
  }

  animate(value) {
    Animated.timing(
      // Animate over time
      this.state.imageHeight, // The animated value to drive
      {
        toValue: value, // Animate to opacity: 1 (opaque)
        duration: 250 // Make it take a while
      }
    ).start(); // Starts the animation
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        this.props.navigator.pop();
        break;
      default:
      // console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  render() {
    const { imageHeight } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            backgroundColor: "#5786CE",
            justifyContent: "center",
            alignItems: "center",
            height: imageHeight
          }}
        >
          <Image
            style={styles.logo}
            source={require("../../img/diabetes_ninja_logo.png")}
          />
        </Animated.View>

        <View style={{ flex: 2 }}>
          <View style={commonCss.CommonStyles.formAreaContainer}>
            <Text style={commonCss.CommonStyles.inputLabel}>
              Registreringen klar
            </Text>

            <Text style={commonCss.CommonStyles.welcomeText}>
              Ditt lösenord har skickats till {this.props.signup.email}. Tryck OK för att återgå till inloggningssidan.
            </Text>

            <TouchableOpacity onPress={this.onOkPress.bind(this)} style={{ marginTop: 20 }}>
              <View style={commonCss.CommonStyles.buttonView} elevation={3}>
                <Text style={commonCss.CommonStyles.buttontext}>OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  onOkPress() {
    this.props.appActions.logout();

    this.props.navigator.resetTo({
      title: "",
      screen: "diabetesNinja.LoginScreen",
      overrideBackPress: true,
      passProps: {}
    });

    //this.props.navigator.pop();
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
    signup: state.signup
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(applicationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpCompleteScreen);
