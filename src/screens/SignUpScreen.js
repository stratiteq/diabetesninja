import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as signupActions from '../redux/signup/actions';
import * as networkActions from '../redux/network/actions';
import SignupTab from '../components/SignupTab';
import * as navigatorStyles from '../styles/NavigatorStyles';

class SignUpScreen extends Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    navBarHidden: false,
  };

  constructor(props) {
    super(props);
    this.registerPressed = this.registerPressed.bind(this);
    this.onReadTerms = this.onReadTerms.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.props.networkActions.changeIsConnectedState(isConnected);
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
  }
  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      default:
        break;
    }
  }

  onReadTerms() {
    this.props.navigator.push({
      title: 'Villkor',
      screen: 'diabetesNinja.TermsAndConditions',
      overrideBackPress: true,
      passProps: {},
    });
  }

  handleConnectionChange = (isConnected) => {
    this.props.networkActions.changeIsConnectedState(isConnected);
  };

  registerPressed(signupUserInfo) {
    this.props.signupActions.attemptSignup(signupUserInfo, () => {
      this.props.navigator.push({
        screen: 'diabetesNinja.SignUpCompleteScreen',
      });
    });
  }

  render() {
    return (
      <View stlye={{ flex: 1 }}>
        <SignupTab
          onReadTerms={this.onReadTerms}
          onSignupPressed={this.registerPressed}
          signupError={this.props.signup.error}
          signingUp={this.props.signup.signingIn}
        />
      </View>
    );
  }
}

// which props do we want to inject, given the global state?
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
    signupActions: bindActionCreators(signupActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
  };
}

SignUpScreen.propTypes = {
  signup: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  networkActions: PropTypes.object.isRequired,
  signupActions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
