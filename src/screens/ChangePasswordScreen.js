import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Input, Item, List, ListItem, Spinner, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import * as accountActions from '../redux/account/actions';
import * as navigatorStyles from '../styles/NavigatorStyles';
import CommonStyle from '../styles/CommonStyles';

class ChangePasswordScreen extends React.Component {
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
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onSavePassword = this.onSavePassword.bind(this);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      case 'save':
        this.onSavePassword();
        break;
      default:
        break;
    }
  }

  onSavePassword() {
    if (this.props.updating) return;

    if (this.state.newPassword.length < 6) {
      this.displayMessage('Valideringsfel', 'Lösenordet måste innehålla minst 6 tecken.', null);
      return;
    }
    if (this.state.newPassword !== this.state.repeatPassword) {
      this.displayMessage('Valideringsfel', 'Lösenorden stämmer inte överens. Se till att du bekräftar ditt lösenord.', null);
      return;
    }

    this.props.accountActions.changePassword(this.state.oldPassword, this.state.newPassword, () => {
      switch (this.props.changePasswordStatus) {
        case 'error':
          this.displayMessage('Ett fel uppstod', 'Verifiera att du har angett ditt gamla lösenord korrekt.', null);
          break;
        default:
          this.displayMessage('Klart', 'Lösenordet är nu uppdaterat.', () => {
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
          <Text>Nuvarande lösenord</Text>
        </ListItem>
        <ListItem last style={[CommonStyle.listItem, { flexDirection: 'column' }]}>
          <Item>
            <Input
              clearButtonMode="while-editing"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Ange ditt nuvarande lösenord"
              onChangeText={oldPassword => this.setState({ oldPassword })}
              value={this.state.oldPassword}
            />
          </Item>
        </ListItem>

        <ListItem
          style={CommonStyle.listItemHeader}
          itemHeader
          first
        >
          <Text>Nytt lösenord</Text>
        </ListItem>
        <ListItem last style={[CommonStyle.listItem, { flexDirection: 'column' }]}>
          <Item floatingLabel>
            <Input
              clearButtonMode="while-editing"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Ange ditt nya lösenord"
              onChangeText={newPassword => this.setState({ newPassword })}
              value={this.state.newPassword}
            />
          </Item>
          <Item floatingLabel>
            <Input
              clearButtonMode="while-editing"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Bekräfta lösenordet"
              onChangeText={repeatPassword => this.setState({ repeatPassword })}
              value={this.state.repeatPassword}
            />
          </Item>
        </ListItem>
      </List>);
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

ChangePasswordScreen.defaultProps = {
  accountActions: null,
  updating: false,
  changePasswordStatus: null,
};

ChangePasswordScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  accountActions: PropTypes.object,
  updating: PropTypes.bool,
  changePasswordStatus: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    updating: state.account.updating,
    changePasswordStatus: state.account.changePasswordStatus,
    app: state.app,
    account: state.account,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);
