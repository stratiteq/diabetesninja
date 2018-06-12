import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Input, Item, List, ListItem, Spinner, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import * as accountActions from '../redux/account/actions';
import * as appActions from '../redux/app/actions';
import * as navigatorStyles from '../styles/NavigatorStyles';
import CommonStyle from '../styles/CommonStyles';

class ChangeUserNameScreen extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: 'save',
          title: 'Spara',
        },
      ],
    });

    this.state = {
      userName: this.props.app.loggedInUser.FirstName,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onSaveName = this.onSaveName.bind(this);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      case 'save':
        this.onSaveName();
        break;
      default:
        break;
    }
  }

  onSaveName() {
    if (this.props.updating) return;

    if (this.state.userName.length < 4) {
      this.displayMessage('Valideringsfel', 'Namnet måste innehålla minst 3 tecken.', null);
      return;
    }

    this.props.accountActions.update({ FirstName: this.state.userName }, () => {
      switch (this.props.updatingStatus) {
        case 'error':
          this.displayMessage('Ett fel uppstod', 'Verifiera att du har angett ett korrekt namn. Kontakta oss i DiabetesNinja-gruppen på FaceBook om felet kvarstår.', null);
          break;
        default:
          this.props.appActions.updateUserIfo({ FirstName: this.state.userName });
          this.displayMessage('Klart', 'Namnet är nu uppdaterat.', () => {
            this.props.navigator.pop();
          });
          break;
      }
    });
  }

  displayMessage(title, message, callback) {
    Alert.alert(
      title,
      message,
      [{
        text: 'OK',
        onPress: () => { if (callback !== null) callback(); },
      }],
    );
  }

  renderSpinner() {
    if (!this.props.updating) return null;

    return (
      <Spinner color="#5786CE" style={{ marginTop: 50 }} />
    );
  }

  renderForm() {
    if (this.props.updating) return null;

    return (
      <List style={CommonStyle.listWithHeader}>
        <ListItem
          style={CommonStyle.listItemHeader}
          itemHeader
          first
        >
          <Text>Ditt namn</Text>
        </ListItem>
        <ListItem last style={[CommonStyle.listItem, { flexDirection: 'column' }]}>
          <Item>
            <Input
              placeholder="Ange ditt namn"
              spellCheck={false}
              onChangeText={userName => this.setState({ userName })}
              value={this.state.userName}
            />
          </Item>
        </ListItem>
      </List>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container style={CommonStyle.container}>
          <Content>
            {this.renderSpinner()}
            {this.renderForm()}
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

ChangeUserNameScreen.defaultProps = {
  accountActions: null,
  appActions: null,
  updating: false,
  updatingStatus: null,
  app: null,
};

ChangeUserNameScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  accountActions: PropTypes.object,
  appActions: PropTypes.object,
  updating: PropTypes.bool,
  updatingStatus: PropTypes.string,
  app: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    updating: state.account.updating,
    updatingStatus: state.account.updatingStatus,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserNameScreen);
