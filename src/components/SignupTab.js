import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { CheckBox } from 'native-base';
import * as commonCss from '../styles/CommonStyles';

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

class SignupTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userFirstName: '',
      userInvitationCode: '',
      termsAccepted: false,
    };

    this.renderSpinner = this.renderSpinner.bind(this);
    this.onTermsAccepted = this.onTermsAccepted.bind(this);
    this.onReadTerms = this.onReadTerms.bind(this);
  }

  onReadTerms() {
    this.props.onReadTerms();
  }

  onTermsAccepted() {
    this.setState({ termsAccepted: !this.state.termsAccepted });
  }

  setUserText(text) {
    this.setState({
      userEmail: text,
    });
  }
  setUserFirstName(text) {
    this.setState({
      userFirstName: text,
    });
  }

  setUserInvitationCode(text) {
    this.setState({
      userInvitationCode: text,
    });
  }

  signupPressed() {
    // eslint-disable-next-line no-useless-escape
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.userEmail) === false) {
      Alert.alert('Validering', 'Vänligen ange en korrekt e-postadress');
      return;
    }
    const signUpInfo = {
      email: this.state.userEmail,
      firstName: this.state.userFirstName,
      invitationCode: this.state.userInvitationCode,
      mode: 'SignUp',
    };

    this.props.onSignupPressed(signUpInfo);
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
      <ScrollView style={{ padding: 30 }}>
        {this.props.signupError && (
          <Text style={styles.error}>{this.props.signupError}</Text>
        )}
        <View style={commonCss.CommonStyles.input}>
          <TextInput
            keyboardType="email-address"
            placeholderTextColor="#555555"
            placeholder="E-postadress"
            underlineColorAndroid="#00000000"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            textAlign="center"
            onChangeText={text => this.setUserText(text)}
          />
        </View>

        <View style={commonCss.CommonStyles.input}>
          <TextInput
            keyboardType="default"
            placeholderTextColor="#555555"
            placeholder="Förnamn"
            underlineColorAndroid="#00000000"
            clearButtonMode="while-editing"
            textAlign="center"
            onChangeText={text => this.setUserFirstName(text)}
          />
        </View>

        <View style={commonCss.CommonStyles.input}>
          <TextInput
            keyboardType="numeric"
            placeholderTextColor="#555555"
            placeholder="Inbjudningskod (valfritt)"
            underlineColorAndroid="#00000000"
            clearButtonMode="while-editing"
            textAlign="center"
            onChangeText={text => this.setUserInvitationCode(text)}
          />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <Text style={{ color: '#333', marginLeft: 5 }}>Godkänner </Text>
          <TouchableOpacity onPress={this.onReadTerms}>
            <Text style={{ fontWeight: 'bold', color: '#5786CE' }}>
              villkoren
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginRight: 15 }}>
            <CheckBox
              style={{ alignSelf: 'flex-end' }}
              checked={this.state.termsAccepted}
              onPress={this.onTermsAccepted}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={!this.state.termsAccepted}
          onPress={() => this.signupPressed()}
        >
          <View
            style={[
              commonCss.CommonStyles.buttonView,
              !this.state.termsAccepted && { backgroundColor: '#888', borderColor: '#888' },
            ]}
            elevation={3}
          >
            <Text style={commonCss.CommonStyles.buttontext}>
              SKAPA ANVÄNDARE
            </Text>

            {this.props.signingUp ? this.renderSpinner() : <View />}
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

SignupTab.defaultProps = {
};

SignupTab.propTypes = {
  onSignupPressed: PropTypes.func.isRequired,
  signingUp: PropTypes.bool.isRequired,
  signupError: PropTypes.string.isRequired,
  onReadTerms: PropTypes.func.isRequired,
};

export default SignupTab;
