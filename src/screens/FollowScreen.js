import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Keyboard
} from "react-native";
import { bindActionCreators } from "redux";
import * as loginActions from "../redux/login/actions";
import * as userLogActions from "../redux/userlog/actions";
import * as accountActions from "../redux/account/actions";
import * as inviteActions from "../redux/invite/actions";
import * as externalUserDataActions from "../redux/externalUserData/actions";
import * as navigatorStyles from "../styles/NavigatorStyles";
import * as commonCss from "../styles/CommonStyles";

// eslint-disable-next-line import/no-unresolved
const menuIcon = require("../../img/ic_menu_white.png");

const styles = StyleSheet.create({
  container: {    
    padding: 20,
    flex: 1
  },
  header: {    
    fontSize: 15
  },
  followingUsername: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#222"
  },
  newUsername: {    
    height: 50,
    fontWeight: "bold",
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#5786CE",
    padding: Platform.OS === "ios" ? 10 : 0,
    fontSize: 30,    
  },
  button: {
    marginLeft: 0,
    marginTop: 10,
    marginBottom:10,
    marginRight: 0
  },
  instructions: {
    textAlign: "center"
  }
});

class FollowScreen extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  static navigatorButtons = {
    leftButtons: [
      {
        id: "menu",
        icon: menuIcon
      }
    ]
  };

  constructor(props) {
    super(props);

    this.state = {
      newCode: ""
    };

    this.onUseInvite = this.onUseInvite.bind(this);
    this.updateAllData = this.updateAllData.bind(this);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  async componentWillMount() {
    this.props.inviteActions.getMyFollowers();
  }

  onUseInvite() {
    this.props.accountActions.connectByInvitationCode(
      this.state.newCode,
      () => {
        this.props.loginActions.attemptRefreshToken(() => {
          Alert.alert(
            `Du följer nu ${this.getUserNameYouAreFollowing()}`,
            "All data som presenteras och alla loggningar som utförs är kopplade till kontot som du följer.",
            [
              {
                text: "OK",
                onPress: () => {
                  this.updateAllData();
                  this.props.navigator.pop();
                }
              }
            ],
            { cancelable: false }
          );
        });
      }
    );
    Keyboard.dismiss();
  }

  onCancelLog() {
    this.props.navigator.pop();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        this.props.navigator.pop();
        break;
      case "menu":
        this.props.navigator.toggleDrawer({
          side: "left",
          passProps: {}
        });
        break;
      default:
    }
  }

  getUserNameYouAreFollowing() {
    if (
      !this.props.app.loggedInUser.Granted ||
      this.props.app.loggedInUser.Granted.length === 0
    ) {
      return "dig själv";
    }
    return this.props.app.loggedInUser.Granted[0].GrantUserFirstName;
  }

  getUserYouAreFollowing() {
    if (
      !this.props.app.loggedInUser.Granted ||
      this.props.app.loggedInUser.Granted.length === 0
    ) {
      return <View />;
    }
    return (
      <View>
        <Text style={styles.header}>Du följer just nu: </Text>
        <Text style={styles.followingUsername}>
          {this.props.app.loggedInUser.Granted[0].GrantUserFirstName}
        </Text>
      </View>
    );
  }

  updateAllData() {
    const fromDate = moment(new Date()).add(-7, "day");
    this.props.userLogActions.resetUserLogFromApi(fromDate);
    this.props.externalUserDataActions.resetExternalDataFromApi();
  }

  renderHasFollowers() {
    if (this.props.invite.followers.length === 0) return null;

    return (
      <View>
        <Text>
          Du kan inte följa någon när du redan har följare. Gå till Bjud
          in-menyn för att ta bort följare om du istället vill följa någon.
        </Text>
      </View>
    );
  }

  renderView() {
    if (
      this.props.invite.followers.length !== 0 ||
      this.props.invite.loadingFollowers
    )
      return null;

    return (
      <View>
        <Text style={styles.instructions}>
          Om du vill följa en ny person var god och knappa in inbjudningskoden
          från personen du vill följa i nedan textfält.{" "}
        </Text>

        <TextInput
          keyboardType="numeric"
          style={styles.newUsername}
          selectTextOnFocus
          multiline={false}
          maxLength={8}
          underlineColorAndroid="#00000000"
          textAlign="center"
          value={this.state.newCode}
          onChangeText={text => {
            this.setState({
              newCode: text
            });
          }}
        />
        <TouchableOpacity onPress={this.onUseInvite}>
          <View
            style={[commonCss.CommonStyles.buttonView, styles.button]}
            elevation={3}
          >
            <Text style={commonCss.CommonStyles.buttontext}>KOPPLA</Text>
          </View>
        </TouchableOpacity>

        {this.getUserYouAreFollowing()}      

        {this.props.account.error && (
          <Text style={{ color: "#F00" }}>{this.props.account.error}</Text>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHasFollowers()}
        {this.renderView()}
      </View>
    );
  }
}

FollowScreen.defaultProps = {
  userLogActions: null,
  accountActions: null,
  inviteActions: null,
  loginActions: null,
  externalUserDataActions: null,
  invite: null,
  account: null,
  app: null
};

FollowScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  userLogActions: PropTypes.object,
  inviteActions: PropTypes.object,
  accountActions: PropTypes.object,
  loginActions: PropTypes.object,
  externalUserDataActions: PropTypes.object,
  invite: PropTypes.object,
  account: PropTypes.object,
  app: PropTypes.object
};

function mapStateToProps(state) {
  return {
    app: state.app,
    account: state.account,
    invite: state.invite
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
    userLogActions: bindActionCreators(userLogActions, dispatch),
    accountActions: bindActionCreators(accountActions, dispatch),
    inviteActions: bindActionCreators(inviteActions, dispatch),
    externalUserDataActions: bindActionCreators(
      externalUserDataActions,
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowScreen);
