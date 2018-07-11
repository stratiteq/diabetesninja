import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Keyboard, Linking, Platform, StyleSheet, Switch, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Icon, H2, Left, List, ListItem, Right, Body, Text, View } from 'native-base';
import { bindActionCreators } from 'redux';
import * as accountActions from '../redux/account/actions';
import * as pushActions from '../redux/push/actions';
import * as navigatorStyles from '../styles/NavigatorStyles';
import CommonStyle from '../styles/CommonStyles';

// eslint-disable-next-line import/no-unresolved
const menuIcon = require('../../img/ic_menu_white.png');

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    marginBottom: 5,
    marginTop: 20,
  },
  button: {
    margin: 20,
    backgroundColor: '#5786CE',
  },
});

class UserAccountScreen extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'menu',
        icon: menuIcon,
      },
    ],
  };

  constructor(props) {
    super(props);

    this.state = {
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onChangePasswordPress = this.onChangePasswordPress.bind(this);
    this.onChangeUserNamePress = this.onChangeUserNamePress.bind(this);
    this.onChangeSettings = this.onChangeSettings.bind(this);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      case 'menu':
        this.props.navigator.toggleDrawer({
          side: 'left',
          passProps: {},
        });
        break;
      default:
    }
  }

  onChangeSettings() {
    this.props.navigator.push({
      title: 'Inställningar',
      screen: 'diabetesNinja.ChangeUserSettingsScreen',
      overrideBackPress: false,
      passProps: {},
    });
  }

  onChangePasswordPress() {
    this.props.navigator.push({
      title: 'Byt lösenord',
      screen: 'diabetesNinja.ChangePasswordScreen',
      overrideBackPress: false,
      passProps: {},
    });
  }

  onChangeUserNamePress() {
    this.props.navigator.push({
      title: 'Byt namn',
      screen: 'diabetesNinja.ChangeUserNameScreen',
      overrideBackPress: false,
      passProps: {},
    });
  }

  togglePushState(newPushOnState) {
    // console.log(`Start set push on = ${newPushOnState}`);
    this.props.pushActions.togglePush(newPushOnState, Platform.OS);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container style={CommonStyle.container}>
          <Content>
            <List style={CommonStyle.list}>
              <ListItem icon onPress={this.onChangeSettings}>
                <Left>
                  <Icon name="cog" />
                </Left>
                <Body>
                  <Text>Inställningar</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem icon onPress={this.onChangePasswordPress}>
                <Left>
                  <Icon name="hand" />
                </Left>
                <Body>
                  <Text>Byt lösenord</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem icon onPress={this.onChangeUserNamePress}>
                <Left>
                  <Icon name="person" />
                </Left>
                <Body>
                  <Text>Byt namn</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="notifications" />
                </Left>
                <Body>
                  <Text>Push notiser</Text>
                  <Text note style={{fontSize:10}}>Aktivera notifieringar vid BS loggning</Text>
                </Body>
                <Right>
                  <Switch
                    onValueChange={state => this.togglePushState(state)}
                    value={this.props.push.isPushOn}
                  />
                </Right>
              </ListItem>
            </List>
            <View style={styles.infoContainer}>
              <H2 style={styles.title}>Avsluta konto</H2>
              <Text note>
                Gå till <Text note style={{ color: 'blue' }} onPress={() => Linking.openURL('http://www.diabetesninja.se/contact')}>diabetesninja.se/contact</Text> för att avsluta ditt konto.
                Om kontot har följare kommer även dessa följningar att tas bort.
              </Text>
              <H2 style={styles.title}>Begära ut uppgifter</H2>
              <Text note>
                Enligt GDPR skall alla användare ha möjlighet att hämta ut uppgifter som
                finns lagrade om sin användare. Gå till <Text note style={{ color: 'blue' }} onPress={() => Linking.openURL('http://www.diabetesninja.se/contact')}>diabetesninja.se/contact</Text> för mer information om hur du begär ut dina uppgifter.
              </Text>
            </View>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

UserAccountScreen.defaultProps = {
  pushActions: null,
  push: null,
};

UserAccountScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  pushActions: PropTypes.object,
  push: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    push: state.push,
    app: state.app,
    account: state.account,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushActions: bindActionCreators(pushActions, dispatch),
    accountActions: bindActionCreators(accountActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountScreen);
