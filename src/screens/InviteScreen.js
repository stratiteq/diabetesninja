import React from 'react';
import PropTypes from 'prop-types';
// import LanguageResources from '../I18n/I18n';
import { StyleSheet, Text, View, Share, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyFollowersList from '../components/account/MyFollowersList';
import * as commonCss from '../styles/CommonStyles';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as inviteActions from '../redux/invite/actions';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    margin: 10,
  },
  inviteCode: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 45,
    marginBottom: 10,
  },
  myFollowersTitle: {
    marginLeft: 10,
  },
});

class InviteScreen extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.onCancel = this.onCancel.bind(this);
    this.onShare = this.onShare.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderLoading = this.renderLoading.bind(this);
    this.renderInviteCode = this.renderInviteCode.bind(this);
    this.removeFollowerTapped = this.removeFollowerTapped.bind(this);
    this.removeFollower = this.removeFollower.bind(this);
  }

  componentWillMount() {
    this.props.inviteActions.getInvitationCode();
    this.props.inviteActions.getMyFollowers();
  }

  onCancel() {
    this.props.navigator.pop();
  }

  onShare() {
    Share.share(
      {
        message: `Ladda ner DiabetesNinja appen och ange ${
          this.props.invite.invitationCode
        } som inbjudningskod.`,
        title: 'Följ mig på DiabetesNinja',
      },
      {
        // Android only:
        dialogTitle: 'Hur vill du dela din kod?',
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'menu':
        this.props.navigator.toggleDrawer({
          side: 'left',
          passProps: {},
        });
        break;
      default:
    }
  }

  removeFollowerTapped(user) {
    Alert.alert(
      'Ta bort följare',
      `Vill du ta bort ${user.firstName} från dina följare?`,
      [
        { text: 'Avbryt' },
        { text: 'OK', onPress: () => { this.removeFollower(user); } },
      ],
    );
  }

  removeFollower(user) {
    this.props.inviteActions.removeFollower(user, () => {
      this.props.inviteActions.getMyFollowers();
    }, null);
  }

  renderLoading() {
    return (
      <View>
        <ActivityIndicator color="#5786CE" size="large" />
        <Text style={styles.inputLabel}>Skapar inbjudningskod...</Text>
      </View>
    );
  }

  renderInviteCode() {
    return (
      <View>
        <Text style={styles.inputLabel}>
          Använd denna kod för att dela din information med andra. Tryck på
          knappen nedan för att skicka koden med epost eller SMS.
          {/* {LanguageResources.t("inviteInstuctions1") + " "}
          {LanguageResources.t("inviteInstuctions2")} */}
        </Text>
        <Text style={styles.inviteCode}>
          {this.props.invite.invitationCode}
        </Text>
        <TouchableOpacity onPress={this.onShare}>
          <View style={commonCss.CommonStyles.buttonView} elevation={3}>
            <Text style={commonCss.CommonStyles.buttontext}>
              BJUD IN FÖLJARE
            </Text>
          </View>
        </TouchableOpacity>
        {this.props.invite.followers.length !== 0 &&
          <Text style={styles.myFollowersTitle}>DINA FÖLJARE</Text>}

        <MyFollowersList
          removeFollower={this.removeFollowerTapped}
          followers={this.props.invite.followers}
          loading={this.props.invite.removingFollower || this.props.invite.loadingFollowers}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.invite.loading
          ? this.renderLoading()
          : this.renderInviteCode()}
      </View>
    );
  }
}

InviteScreen.defaultProps = {
  inviteActions: null,
  invite: null,
};

InviteScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  inviteActions: PropTypes.object,
  invite: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    invite: state.invite,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inviteActions: bindActionCreators(inviteActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteScreen);
