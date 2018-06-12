import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as iPhoneXHelper from 'react-native-iphone-x-helper';
import { ActivityIndicator, Animated, AsyncStorage, Image, View, Keyboard, NetInfo, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../redux/login/actions';
import * as signupActions from '../redux/signup/actions';
import * as appactions from '../redux/app/actions';
import * as networkActions from '../redux/network/actions';
import * as commonCss from '../styles/CommonStyles';
import BottomGraphic from '../components/BottomGraphic';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as storageKeys from '../constants/storageKeys';

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  logo: {
    ...iPhoneXHelper.ifIphoneX(
      {
        marginTop: 40,
        marginBottom: 20,
      },
      {
        marginTop: 30,
        marginBottom: 30,
      },
    ),
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#D9FFFFFF',
    marginBottom: 5,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 4,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#5786CE',
  },
  error: {
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

class LoginScreen extends Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    navBarHidden: true,
    drawUnderNavBar: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageHeight: new Animated.Value(iPhoneXHelper.isIphoneX() ? 230 : 220),
      userEmail: '',
      userPassword: '',
    };

    this.onRegistrationPress = this.onRegistrationPress.bind(this);
    this.renderSpinner = this.renderSpinner.bind(this);
    this.onForgottenPassword = this.onForgottenPassword.bind(this);
    this.loginPressed = this.loginPressed.bind(this);
    this.setUserText = this.setUserText.bind(this);
    this.setPasswordText = this.setPasswordText.bind(this);
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => this.keyboardDidShow(),
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => this.keyboardDidHide(),
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => this.keyboardDidShow(),
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => this.keyboardDidHide(),
      );
    }

    NetInfo.isConnected.fetch().then((isConnected) => {
      this.props.networkActions.changeIsConnectedState(isConnected);
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );

    await this.loadEmailAddress();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onForgottenPassword() {
    const optionChosen = 'diabetesNinja.ForgottenPassword';
    const titleChosen = 'Glömt lösenord?';

    this.props.navigator.push({
      title: titleChosen,
      screen: optionChosen,
      overrideBackPress: true,
      passProps: {},
    });
  }

  onRegistrationPress() {
    this.props.navigator.push({
      title: 'Registrera konto',
      screen: 'diabetesNinja.SignUpScreen',
      overrideBackPress: true,
      passProps: {},
    });
  }

  setUserText(text) {
    this.setState({
      userEmail: text,
    });
  }
  setPasswordText(text) {
    this.setState({
      userPassword: text,
    });
  }

  animate(value) {
    if (iPhoneXHelper.isIphoneX()) return;
    Animated.timing(
      this.state.imageHeight,
      {
        toValue: value,
        duration: 250,
      },
    ).start();
  }

  async loadEmailAddress() {
    try {
      const storedEmailAddress = await AsyncStorage.getItem(storageKeys.LOGIN_LAST_EMAIL);
      this.setState({
        userEmail: storedEmailAddress !== null ? String(storedEmailAddress) : '',
      });
    } catch (e) {
      // Catch this
    }
  }

  keyboardDidShow() {
    this.animate(iPhoneXHelper.isIphoneX() ? 50 : 0);
  }


  keyboardDidHide() {
    this.animate(iPhoneXHelper.isIphoneX() ? 250 : 200);
  }

  handleConnectionChange = (isConnected) => {
    this.props.networkActions.changeIsConnectedState(isConnected);
  };

  loginPressed() {
    const loginInfo = {
      email: this.state.userEmail,
      password: this.state.userPassword,
      mode: 'SignIn',
    };

    this.props.actions.attemptlogin(loginInfo);
  }

  renderSpinner() {
    return (
      <ActivityIndicator
        color="#ffffff"
        size="small"
        animating
        style={{
          position: 'absolute',
          right: 15,
        }}
      />
    );
  }

  render() {
    const { imageHeight } = this.state;
    return (
      <View style={styles.loginContainer}>
        <Animated.View
          style={{
            backgroundColor: '#5786CE',
            justifyContent: 'center',
            alignItems: 'center',
            height: imageHeight,
          }}
        >
          <Image
            style={styles.logo}
            source={require('../../img/diabetes_ninja_logo.png')}
          />
        </Animated.View>

        <View style={commonCss.CommonStyles.formAreaContainer}>
          {this.props.login.error !== null && (
            <Text style={styles.error}>{this.props.login.error}</Text>
          )}

          <View style={commonCss.CommonStyles.input}>
            <TextInput
              keyboardType="email-address"
              placeholderTextColor="#555555"
              placeholder="E-postadress"
              underlineColorAndroid="#00000000"
              textAlign="center"
              value={this.state.userEmail}
              clearButtonMode="while-editing"
              autoCapitalize="none"
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              onChangeText={text => this.setUserText(text)}
            />
          </View>

          <View style={commonCss.CommonStyles.input}>
            <TextInput
              returnKeyType="done"
              clearButtonMode="while-editing"
              placeholderTextColor="#555555"
              placeholder="Lösenord"
              secureTextEntry
              underlineColorAndroid="#00000000"
              ref={(input) => {
                this.passwordInput = input;
              }}
              onSubmitEditing={this.loginPressed}
              textAlign="center"
              value={this.state.userPassword}
              onChangeText={text => this.setPasswordText(text)}
            />
          </View>

          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={this.onForgottenPassword}
            >
              <Text style={styles.linkText}>Glömt lösenord?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={this.onRegistrationPress}
            >
              <Text style={styles.linkText}>Registrera konto</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={this.loginPressed}>
            <View style={commonCss.CommonStyles.buttonView} elevation={3}>
              <Text style={commonCss.CommonStyles.buttontext}>LOGGA IN</Text>
              {this.props.login.logginIn ? this.renderSpinner() : <View />}
            </View>
          </TouchableOpacity>
        </View>

        <BottomGraphic />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
    signup: state.signup,
    app: state.app,
    network: state.network,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch),
    signupActions: bindActionCreators(signupActions, dispatch),
    globalActions: bindActionCreators(appactions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
  };
}

LoginScreen.propTypes = {
  login: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  networkActions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
