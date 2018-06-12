import React from 'react';
import { AsyncStorage, Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { PropTypes } from 'prop-types';
import * as commonCss from '../styles/CommonStyles';
import * as storageKeys from '../constants/storageKeys';

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  linkButton: {
    padding: 5,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#5786CE',
  },
});

class LoginTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',
      userPassword: '',
    };
    this.renderSpinner = this.renderSpinner.bind(this);
    this.onForgottenPassword = this.onForgottenPassword.bind(this);
    this.loginPressed = this.loginPressed.bind(this);
  }

  async componentDidMount() {
    await this.loadEmailAddress();
  }

  onForgottenPassword() {
    this.props.onForgottenPassword();
  }

  setUserText(text) {
    this.setState({
      userEmail: text,
    });
  }

  setPwdText(text) {
    this.setState({
      userPassword: text,
    });
  }

  async loginPressed() {
    const signInInfo = {
      email: this.state.userEmail,
      password: this.state.userPassword,
      mode: 'SignIn',
    };
    this.props.onLoginPressed(signInInfo);
  }

  async loadEmailAddress() {
    try {
      const storedEmailAddress =
        await AsyncStorage.getItem(storageKeys.LOGIN_LAST_EMAIL);
      this.setState({
        userEmail: storedEmailAddress !== null ? String(storedEmailAddress) : '',
      });
    } catch (e) {
      // Handle exception
    }
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
    return (
      <View style={commonCss.CommonStyles.formAreaContainer}>
        {this.props.loginError !== null && (
          <Text style={styles.error}>{this.props.loginError}</Text>
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
            keyboardType="numeric"
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
            onChangeText={text => this.setPwdText(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={this.onForgottenPassword}
        >
          <Text style={styles.linkText}>Glömt lösenord?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.loginPressed}>
          <View style={commonCss.CommonStyles.buttonView} elevation={3}>
            <Text style={commonCss.CommonStyles.buttontext}>LOGGA IN</Text>
            {this.props.loggingIn ? this.renderSpinner() : <View />}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

LoginTab.defaultProps = {
  loginError: null,
  loggingIn: false,
};

LoginTab.propTypes = {
  onLoginPressed: PropTypes.func.isRequired,
  onForgottenPassword: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  loggingIn: PropTypes.bool,
};

export default LoginTab;
