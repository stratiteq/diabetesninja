import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { StyleSheet, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ripple from 'react-native-material-ripple';
import { Root, Icon, ActionSheet } from 'native-base';
import Tabbar from 'react-native-tabbar-bottom';
import { isIphoneX } from 'react-native-iphone-x-helper';

import * as userLogActions from '../redux/userlog/actions';
import * as externalUserDataActions from '../redux/externalUserData/actions';
import DashboardNotes from '../components/dashboard/DashboardNotes';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import * as navigatorStyles from '../styles/NavigatorStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 0,
    paddingTop: Platform.OS === 'ios' ? 0 : 60,
    paddingBottom: 60,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: isIphoneX() ? 20 : 0,
  },
  bottom: {
    position: 'absolute',
    bottom: 3,
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#954A75',
    flex: 1,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

class DashboardScreen extends React.Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    drawUnderNavBar: true,
  };

  static navigatorButtons = {};

  constructor(props) {
    super(props);

    this.props.navigator.setButtons({
      leftButtons: [
        {
          id: 'menu',
          // eslint-disable-next-line import/no-unresolved
          icon: require('../../img/ic_menu_white.png'),
        },
      ],
      rightButtons: [
        {
          id: 'update',
          // eslint-disable-next-line import/no-unresolved
          icon: require('../../img/ic_autorenew_white.png'),
        },
      ],
      animated: true,
    });

    // eslint-disable-next-line no-use-before-define
    rootNavigator = this.props.navigator;

    this.navigating = false;

    this.state = {
      page: 'Overview',
    };
    this.isDoubleTap = this.isDoubleTap.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
    this.getUserYouAreFollowing = this.getUserYouAreFollowing.bind(this);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'menu':
        this.openDrawer();
        break;
      case 'update':
        this.updateAllData();
        break;
      default:
      // console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  onOpenActionSheet() {
    const actionSheetOptions = [
      'Logga blodsocker',
      'Beräkna kolhydrater',
      'Beräkna insulinkvoter',
      'Ny anteckning',
      'Avbryt',
    ];
    const actionSheetCancelIndex = 4;

    ActionSheet.show(
      {
        options: actionSheetOptions,
        cancelButtonIndex: actionSheetCancelIndex,
        tintColor: '#333',
      },
      (buttonIndex) => { this.onNavigate(buttonIndex); },
    );
  }

  onNavigate(navigationOption) {
    if (this.isDoubleTap()) return;

    let optionChosen = '';
    let titleChosen = '';

    switch (navigationOption) {
      case 0:
        optionChosen = 'diabetesNinja.LogBloodSugar';
        titleChosen = 'Logga blodsocker';
        break;
      case 1:
        optionChosen = 'diabetesNinja.LogMeal';
        titleChosen = 'Beräkna kolhydrater';
        break;
      case 2:
        optionChosen = 'diabetesNinja.CalculateInsulin';
        titleChosen = 'Beräkna insulinkvoter';
        break;
      case 3:
        optionChosen = 'diabetesNinja.LogNote';
        titleChosen = 'Ny anteckning';
        break;
      default:
        optionChosen = '';
        break;
    }

    if (optionChosen !== '') {
      this.props.navigator.push({
        title: titleChosen,
        screen: optionChosen,
        overrideBackPress: true,
        passProps: {},
      });
    }
  }

  getUserYouAreFollowing() {
    if (
      !this.props.loggedInUser.Granted ||
      this.props.loggedInUser.Granted.length === 0
    ) {
      return this.props.loggedInUser.FirstName;
    }
    return this.props.loggedInUser.Granted[0].GrantUserFirstName;
  }

  openDrawer() {
    this.props.navigator.toggleDrawer({
      side: 'left',
      passProps: {},
    });
  }

  updateAllData() {
    const fromDate = moment(new Date()).add(-7, 'day');
    this.props.userLogActions.resetUserLogFromApi(fromDate);
    this.props.externalUserDataActions.resetExternalDataFromApi();
  }

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1500) {
      return true;
    }
    this.lastTap = now;
    return false;
  }

  render() {
    this.props.navigator.setTitle({ title: this.getUserYouAreFollowing() });

    return (
      <Root>
        <ActionSheet
          ref={(c) => {
            ActionSheet.actionsheetInstance = c;
          }}
        />
        <View style={styles.container}>
          {this.state.page === 'Overview' && (
            <DashboardOverview onMetricPress={this.onNavigate} />
          )}
          {this.state.page === 'Notes' && (
            <DashboardNotes navigator={this.props.navigator} />
          )}

          <Tabbar
            tabbarBgColor="#EFEFEF"
            labelColor="#AAA"
            selectedLabelColor="#5786CE"
            iconColor="#AAA"
            selectedIconColor="#5786CE"
            stateFunc={(tab) => {
              this.setState({ page: tab.page });
            }}
            activePage={this.state.page}
            tabs={[
              {
                page: 'Overview',
                icon: 'md-stats',
                iconText: 'Översikt',
              },
              {
                page: 'Notes',
                icon: 'md-clipboard',
                iconText: 'Log',
              },
            ]}
          />

          <Ripple style={styles.bottom} onPress={this.onOpenActionSheet}>
            <View>
              <Icon name="add" style={{ color: '#FFF', fontSize: 40 }} />
            </View>
          </Ripple>

          {isIphoneX() && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -20,
                height: 20,
                backgroundColor: '#EFEFEF',
              }}
            />
          )}
        </View>
      </Root>
    );
  }
}

DashboardScreen.defaultProps = {
  loggedInUser: null,
  userLogActions: null,
  externalUserDataActions: null,
};

DashboardScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
  userLogActions: PropTypes.object,
  externalUserDataActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedInUser: state.app.loggedInUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogActions: bindActionCreators(userLogActions, dispatch),
    externalUserDataActions: bindActionCreators(
      externalUserDataActions,
      dispatch,
    ),
  };
}

// eslint-disable-next-line import/no-mutable-exports
export let rootNavigator = null;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
