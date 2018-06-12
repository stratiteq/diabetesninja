import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../redux/login/actions';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as commonCss from '../styles/CommonStyles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
  breadText: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  input: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5786CE',
    padding: Platform.OS === 'ios' ? 10 : 0,
    margin: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4776BE',
    borderColor: '#5786CE',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#FFFFFF',
    paddingRight: 8,
    paddingLeft: 8,
  },
});

class ForgottenPassword extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };

    this.onResetPasswordPressed = this.onResetPasswordPressed.bind(this);
    this.onPasswordResetComplete = this.onPasswordResetComplete.bind(this);
    this.renderSpinner = this.renderSpinner.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onPasswordResetComplete(outcome) {
    if (outcome.successFlag)
      Alert.alert(
        'Tack för din förfrågan',
        outcome.feedbackMsg,
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigator.pop();
            },
          },
        ],
        { cancelable: false },
      );
    else Alert.alert('', outcome.feedbackMsg);
  }

  onResetPasswordPressed() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      Alert.alert('Validering', 'Vänligen ange en korrekt e-postadress');
      console.log('Email is Not Correct');
      return;
    }

    this.props.loginActions.forgottenPassword(
      this.state.email,
      this.onPasswordResetComplete,
    );
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      default:
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
      <View style={styles.container}>
        <Text style={styles.breadText}>
          Vi behöver bara din e-postadress för att skicka ditt nya lösenord till
          dig.
        </Text>

        <TextInput
          keyboardType="email-address"
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          placeholderTextColor="#555555"
          placeholder="e-postadress"
          underlineColorAndroid="#00000000"
          textAlign="center"
        />

        <TouchableOpacity onPress={this.onResetPasswordPressed}>
          <View style={commonCss.CommonStyles.buttonView} elevation={3}>
            <Text style={commonCss.CommonStyles.buttontext}>
              ÅTERSTÄLL LÖSENORD
            </Text>
            {this.props.login.forgonPasswordLoading ? (
              this.renderSpinner()
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  };
}

ForgottenPassword.propTypes = {
  login: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPassword);
