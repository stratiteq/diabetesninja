import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { View, Image, Text, Platform, Alert, NetInfo, AppState, Keyboard } from 'react-native';
import { Container, Content, ListItem, Left, Body, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// eslint-disable-next-line import/no-unresolved, import/extensions, import/no-duplicates
import NotificationsIOS from 'react-native-notifications';
// eslint-disable-next-line import/no-unresolved, import/extensions, import/no-duplicates
import { NotificationsAndroid } from 'react-native-notifications';

import toastMessage from '../../utils/ToastMessage';
import * as loginActions from '../../redux/login/actions';
import * as pushActions from '../../redux/push/actions';
import * as appActions from '../../redux/app/actions';
import * as externalUserDataActions from '../../redux/externalUserData/actions';
import * as userLogActions from '../../redux/userlog/actions';

import * as bloodSugarActions from '../../redux/bloodsugar/actions';
import * as networkActions from '../../redux/network/actions';
import * as settingsActions from '../../redux/settings/actions';

import SideBarItem from './SideBarItem';
import { rootNavigator } from '../../screens/DashboardScreen';
import NavigationStyle from '../../styles/NavigationStyles';

const waterIcon = Platform.OS === 'ios' ? 'water' : 'ios-water';

let mainScreen;

function onNotificationReceived(notification) {
  if (mainScreen) {
    mainScreen.onNotificationReceived(notification);
  }
}

// It's highly recommended to keep listeners registration at global scope
// rather than at screen-scope seeing that component mount and unmount
// lifecycle tend to be asymmetric!
if (Platform.OS !== 'ios') {
  NotificationsAndroid.setNotificationReceivedListener(onNotificationReceived);
}
// end android reg

class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.onDashboardPress = this.onDashboardPress.bind(this);
    this.onInvitePress = this.onInvitePress.bind(this);
    this.onAccountPress = this.onAccountPress.bind(this);
    this.onUserAccountPress = this.onUserAccountPress.bind(this);
    this.onAboutPress = this.onAboutPress.bind(this);
    this.onAboutDiabetesPress = this.onAboutDiabetesPress.bind(this);
    this.onLogoutPress = this.onLogoutPress.bind(this);

    mainScreen = this; // Extra code for android push

    this.state = {
      currentTab: 'diabetesNinja.DashboardScreen',
      appState: AppState.currentState,
    };

    if (Platform.OS === 'ios') {
      NotificationsIOS.addEventListener(
        'remoteNotificationsRegistered',
        this.onPushRegistered.bind(this),
      );
      NotificationsIOS.addEventListener(
        'remoteNotificationsRegistrationFailed',
        this.onPushRegistrationFailed.bind(this),
      );
      NotificationsIOS.addEventListener(
        'notificationReceivedForeground',
        this.onNotificationReceivedForeground.bind(this),
      );
      NotificationsIOS.addEventListener(
        'notificationReceivedBackground',
        this.onNotificationReceivedBackground.bind(this),
      );
      NotificationsIOS.requestPermissions();
    }
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.props.networkActions.changeIsConnectedState(isConnected);
      this.props.loginActions.attemptRefreshToken(() => {
        this.updateAllData();
      }, true);

      this.props.pushActions.CheckForAndRegisterPush(Platform.OS);
    });
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );

    AppState.addEventListener('change', this.handleAppStateChange);

    if (Platform.OS === 'ios') {
      this.updateAllData();
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      NotificationsIOS.removeEventListener(
        'remoteNotificationsRegistered',
        this.onPushRegistered.bind(this),
      );
      NotificationsIOS.removeEventListener(
        'remoteNotificationsRegistrationFailed',
        this.onPushRegistrationFailed.bind(this),
      );
      NotificationsIOS.removeEventListener(
        'notificationReceivedForeground',
        this.onNotificationReceivedForeground.bind(this),
      );
      NotificationsIOS.removeEventListener(
        'notificationReceivedBackground',
        this.onNotificationReceivedBackground.bind(this),
      );
    }

    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );

    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  onPushRegistered(deviceToken) {
    this.props.pushActions.setPlatformPushTokenAsync(deviceToken, Platform.OS);
    // TODO: Send the token to my server so it could send back push notifications...
  }

  onPushRegistrationFailed(error) {
    Alert.alert(error.localizedDescription);
  }

  onNotificationReceivedForeground(notification) {
    this.onNotificationReceived(notification);
  }

  onNotificationReceivedBackground(notification) {
    this.onNotificationReceived(notification);
  }

  onNotificationReceived(notification) {
    if (Platform.OS !== 'ios') {
      if (notification.data.msgType === 'UpdatedBloodGlucose') {
        toastMessage.showInfoMessage('Nya blodsockervärden mottagna. Hämtar nya värden');
        this.updateAllData();
      }
    } else {
      Alert.alert(notification);
    }

    this.props.pushActions.onNotificationReceived(notification);
  }

  onDashboardPress() {
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
    this.onNavigate('diabetesNinja.DashboardScreen', '');
  }

  onInvitePress() {
    this.onNavigate('diabetesNinja.InviteScreen', 'Bjud in');
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  onAccountPress() {
    this.onNavigate('diabetesNinja.FollowScreen', 'Följ');
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  onUserAccountPress() {
    this.onNavigate('diabetesNinja.UserAccountScreen', 'Mitt konto');
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  onAboutPress() {
    this.onNavigate('diabetesNinja.About', 'Om appen');
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  onAboutDiabetesPress() {
    this.onNavigate('diabetesNinja.AboutDiabetesScreen', 'Om diabetes');
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  onLogoutPress() {
    this.props.pushActions.Signoff();
    this.props.loginActions.logout();
  }

  onNavigate(pageChosen, titleChosen) {
    Keyboard.dismiss();
    this.setState({
      currentTab: pageChosen,
    });

    if (pageChosen !== '') {
      rootNavigator.resetTo({
        title: titleChosen,
        screen: pageChosen,
        overrideBackPress: true,
        navigatorButtons: {
          leftButtons: [
            {
              id: 'menu',
              // eslint-disable-next-line import/no-unresolved
              icon: require('../../../img/ic_menu_white.png'),
            },
          ],
        },
        passProps: {},
      });
    }
  }

  handleConnectionChange = (isConnected) => {
    this.props.networkActions.changeIsConnectedState(isConnected);
  };

  updateAllData() {
    const fromDate = moment(new Date()).add(-7, 'day');
    this.props.userLogActions.resetUserLogFromApi(fromDate);
    this.props.externalUserDataActions.resetExternalDataFromApi();
    this.props.settingsActions.loadEffectiveUserSettings();
    //this.props.settingsActions.setInsulinUnitsPerDay(45.2, null);
  }

  handleAppStateChange = (nextAppState) => {
    const enforceDateCheck = true;
    if (
      this.state.appState.match(/inactive|background|uninitialized/) &&
      nextAppState === 'active'
    ) {
      this.props.loginActions.attemptRefreshToken(() => {
        this.updateAllData();
      }, enforceDateCheck);
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <View style={NavigationStyle.viewContainer}>
        <View style={NavigationStyle.headerContainer}>
          <Image source={require('../../../img/Icon_Logo_Header.png')} />
          <Text style={NavigationStyle.headerTitle}>
            Välkommen {this.props.app.loggedInUser.FirstName}
          </Text>
        </View>
        <Container style={NavigationStyle.listContainer}>
          <Content>
            <SideBarItem
              title="Översikt"
              icon="stats"
              currentTab={this.state.currentTab}
              tabName="diabetesNinja.DashboardScreen"
              onItemPress={() => this.onDashboardPress()}
            />
            <SideBarItem
              title="Mitt konto"
              icon="person"
              currentTab={this.state.currentTab}
              tabName="diabetesNinja.UserAccountScreen"
              onItemPress={() => this.onUserAccountPress()}
            />
            {this.props.app.loggedInUser.Granted &&
              this.props.app.loggedInUser.Granted.length === 0 && (
                <SideBarItem
                  title="Bjud in"
                  icon="share"
                  currentTab={this.state.currentTab}
                  tabName="diabetesNinja.InviteScreen"
                  onItemPress={() => this.onInvitePress()}
                />)}
            <SideBarItem
              title="Följ"
              icon="ios-share-alt"
              currentTab={this.state.currentTab}
              tabName="diabetesNinja.FollowScreen"
              onItemPress={() => this.onAccountPress()}
            />
            <SideBarItem
              title="Om diabetes"
              icon={waterIcon}
              currentTab={this.state.currentTab}
              tabName="diabetesNinja.AboutDiabetesScreen"
              onItemPress={() => this.onAboutDiabetesPress()}
            />
            <SideBarItem
              title="Om appen"
              icon="information-circle"
              currentTab={this.state.currentTab}
              tabName="diabetesNinja.About"
              onItemPress={() => this.onAboutPress()}
            />
            <ListItem drawer-toggle icon onPress={this.onLogoutPress}>
              <Left>
                <Icon name="log-out" />
              </Left>
              <Body>
                <Text>Logga ut</Text>
              </Body>
            </ListItem>
          </Content>
        </Container>
      </View>
    );
  }
}

SideBar.defaultProps = {
  pushActions: null,
  app: null,
  userLogActions: null,
  externalUserDataActions: null,
  loginActions: null,
  networkActions: null,
  settingsActions: null,
};

SideBar.propTypes = {
  navigator: PropTypes.object.isRequired,
  pushActions: PropTypes.object,
  app: PropTypes.object,
  userLogActions: PropTypes.object,
  externalUserDataActions: PropTypes.object,
  loginActions: PropTypes.object,
  networkActions: PropTypes.object,
  settingsActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    login: state.login,
    settings: state.settings,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    actions: bindActionCreators(bloodSugarActions, dispatch),
    globalActions: bindActionCreators(appActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
    userLogActions: bindActionCreators(userLogActions, dispatch),
    networkActions: bindActionCreators(networkActions, dispatch),
    pushActions: bindActionCreators(pushActions, dispatch),
    externalUserDataActions: bindActionCreators(
      externalUserDataActions,
      dispatch,
    ),
    settingsActions: bindActionCreators(settingsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
