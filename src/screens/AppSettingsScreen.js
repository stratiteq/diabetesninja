import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Text, Switch, Platform, Alert, RefreshControl, Linking } from 'react-native';
import { Body, Content, Icon, List, ListItem, Left, Right } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CustomTabs } from 'react-native-custom-tabs';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as pushActions from '../redux/push/actions';
import * as userLogActions from '../redux/userlog/actions';
import * as loginActions from '../redux/login/actions';
import * as externalUserDataActions from '../redux/externalUserData/actions';

// eslint-disable-next-line import/no-unresolved
const menuIcon = require('../../img/ic_menu_white.png');

class AppSettingsScreen extends React.Component {
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

    this.props.pushActions.refreshLatestInfo();

    this.handleUrl = this.handleUrl.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDexcomSwitchPress = this.onDexcomSwitchPress.bind(this);
    this.onDisconnectFromDexcom = this.onDisconnectFromDexcom.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onCancel() {
    this.props.navigator.pop();
  }

  onDexcomSwitchPress() {
    if (this.props.app.loggedInUser.UserDevice !== 'DexCom') {
      this.onConnectToDexcom();
    } else {
      Alert.alert(
        'Är du säker på att du vill koppla bort dig från DexCom?',
        null,
        [
          { text: 'Ja', onPress: this.onDisconnectFromDexcom },
          { text: 'Avbryt' },
        ],
        { cancelable: true },
      );
    }
  }

  onConnectToDexcom() {
    const host =
      'https://sandbox-api.dexcom.com/v1/oauth2/login?client_id=GuBGguxdPMXlHKFGsDcNrinhaPKg3GDL&redirect_uri=diabetesninjaapp://appsettings&response_type=code&scope=offline_access&state=0';
    // if (__DEV__) {
    //   host =
    //     'https://sandbox-api.dexcom.com/v1/oauth2/login?client_id=GuBGguxdPMXlHKFGsDcNrinhaPKg3GDL&redirect_uri=diabetesninjaapp://appsettings&response_type=code&scope=offline_access&state=0';
    // }

    CustomTabs.openURL(host, {
      toolbarColor: '#5786CE',
      enableUrlBarHiding: false,
      showPageTitle: true,
      enableDefaultShare: false,
      // For value, specify only full qualifier or only resource name.
      // In the case of the resource name, the module complements the
      // application package in java side.
      animations: {
        startEnter:
          'com.github.droibit.android.reactnative.customtabs.example:anim/slide_in_bottom',
        startExit:
          'com.github.droibit.android.reactnative.customtabs.example:anim/slide_out_bottom',
        endEnter:
          'com.github.droibit.android.reactnative.customtabs.example:anim/slide_in_bottom',
        endExit:
          'com.github.droibit.android.reactnative.customtabs.example:anim/slide_out_bottom',
      },
      headers: {
        'my-custom-header': 'DiabetsNinja',
      },
    })
      .then((launched) => {
        console.log(`Launched custom tabs: ${launched}`);
      })
      .catch((err) => {
        console.error(err);
      });
    Linking.addEventListener('url', this.handleUrl);
  }

  onDisconnectFromDexcom() {
    this.props.externalUserDataActions.dexComDisconnect(() => {
      this.props.loginActions.attemptRefreshToken(() => {
        this.updateAllData();
        Alert.alert('Du är nu bortkopplad från Dexcom!');
      }, false);
    });
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

  updateAllData() {
    const fromDate = moment(new Date()).add(-7, 'day');
    this.props.userLogActions.resetUserLogFromApi(fromDate);
    this.props.externalUserDataActions.resetExternalDataFromApi();
  }

  handleUrl(event) {
    this.props.externalUserDataActions.dexComRegistration(event.url, () => {
      this.props.loginActions.attemptRefreshToken(() => {
        this.updateAllData();
        Alert.alert('Koppling till Dexcom lyckades!');
      }, false);
    });
  }

  togglePushState(newPushOnState) {
    // console.log(`Start set push on = ${newPushOnState}`);
    this.props.pushActions.togglePush(newPushOnState, Platform.OS);
  }

  render() {
    return (
      <Content>
        <List
          refreshControl={
            <RefreshControl
              tintColor="#888"
              colors={['#888']}
              refreshing={
                this.props.externalUserData.currentlyConnectingToDexcom
              }
            />
          }
        >
          <ListItem icon>
            <Left>
              <Icon name="notifications" />
            </Left>
            <Body>
              <Text>Aktivera notifieringar vid BS loggning</Text>
            </Body>
            <Right>
              <Switch
                onValueChange={state => this.togglePushState(state)}
                value={this.props.push.isPushOn}
              />
            </Right>
          </ListItem>
        </List>
      </Content>
    );
  }
}

AppSettingsScreen.defaultProps = {
  pushActions: null,
  userLogActions: null,
  externalUserDataActions: null,
  loginActions: null,
  navigator: null,
  push: null,
  externalUserData: null,
  app: null,
};

AppSettingsScreen.propTypes = {
  externalUserDataActions: PropTypes.object,
  userLogActions: PropTypes.object,
  pushActions: PropTypes.object,
  loginActions: PropTypes.object,
  navigator: PropTypes.object,
  push: PropTypes.object,
  externalUserData: PropTypes.object,
  app: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    push: state.push,
    app: state.app,
    externalUserData: state.externalUserData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushActions: bindActionCreators(pushActions, dispatch),
    userLogActions: bindActionCreators(userLogActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
    externalUserDataActions: bindActionCreators(
      externalUserDataActions,
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettingsScreen);
