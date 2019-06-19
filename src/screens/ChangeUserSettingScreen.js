import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Keyboard, TouchableWithoutFeedback, View, StyleSheet, Text } from 'react-native';
import { Container, Content, Item, List, ListItem, Input } from 'native-base';
import { bindActionCreators } from 'redux';
import * as settingsActions from '../redux/settings/actions';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as commonCss from '../styles/CommonStyles';

const styles = StyleSheet.create({
  itemViewOuter: {
    flex: 1,
    flexDirection: 'column',
  },
});

class ChangeUserSettingScreen extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    const isFollowerCheck = this.checkisFollower();

    if (!isFollowerCheck) {
      this.props.navigator.setButtons({
        rightButtons: [
          {
            id: 'save',
            title: 'Spara',
          },
        ],
      });
    }

    this.state = {
      MinBSValue: this.props.settings.lowerBSLimit.toString(),
      MaxBSValue: this.props.settings.upperBSLimit.toString(),
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onSaveSettings = this.onSaveSettings.bind(this);
    this.validateTextField = this.validateTextField.bind(this);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      case 'save':
        this.onSaveSettings();
        break;
      default:
        break;
    }
  }

  onChangedText(text, field) {
    let newText = '';
    const numbers = '0123456789.,';

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText += text[i];
      }
    }
    this.setState({ [field]: newText });
  }

  onSaveSettings() {
    if (this.isDoubleTap()) return;

    const inputBSMin = this.state.MinBSValue.replace(',', '.');
    const inputBSMax = this.state.MaxBSValue.replace(',', '.');


    const bloodSugarMin = Number.parseFloat(inputBSMin);
    const bloodSugarMax = Number.parseFloat(inputBSMax);

    Keyboard.dismiss();

    if (this.validateTextField(bloodSugarMin, 'Undre Blodsockervärde') && this.validateTextField(bloodSugarMax, 'Övre Blodsockervärde')) {
      if (bloodSugarMin > bloodSugarMax) {
        this.displayMessage('Blodsocker gränsvärden', 'Den lägre gränsen får inte vbara högre än den övre', null);
        return;
      }
      this.props.settingsActions.setNewBSLimits(
        {
          lowerBSLimit: bloodSugarMin,
          upperBSLimit: bloodSugarMax,
        },
        (message) => {
          if (message.length === 0) {
            this.displayMessage('Inställningar sparade', 'Tänk på att det kan ta ett tag innan ändringarna kommer över till ev. följare', null);
          } else {
            this.displayMessage('Fel vid sparning av Inställningar', message, null);
          }
        },
      );
    }
  }

  validateTextField(value, title) {
    if (Number.isNaN(value)) {
      this.displayMessage(title, 'Måste vara ett nummer.', null);
      return false;
    }

    if (value > 30) {
      this.displayMessage(title, 'Värdet är för stort. (Maxvärde: 30)', null);
      return false;
    }

    if (value < 0.1) {
      this.displayMessage(title, 'Värdet är för lågt.', null);
      return false;
    }

    return true;
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

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1500) {
      return true;
    }
    this.lastTap = now;
    return false;
  }

  checkisFollower() {
    if (
      !this.props.app.loggedInUser.Granted ||
      this.props.app.loggedInUser.Granted.length === 0
    ) {
      return false;
    }
    return true;
  }

  renderForm() {
    const isFollower = this.checkisFollower();

    return (
      <View>
        <List style={commonCss.CommonStyles.listWithHeader}>
          <ListItem
            style={commonCss.CommonStyles.listItemHeader}
            itemHeader
            first
          >
            <Item>
              <View>
                <Text>Blodsocker gränsvärden</Text>
                <Text>Visas som referenslinjer på översiktsbilden</Text>
                { !isFollower ? null : (<Text>Kan inte ändras av en följare</Text>)}
              </View>
            </Item>
          </ListItem>
          <ListItem last style={[commonCss.CommonStyles.listItem, { flexDirection: 'column' }]}>
            <Item>
              <View style={styles.itemViewOuter}>
                <View>
                  <Text>Lägre gräns (mmol/l)</Text>
                  <Input
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    selectTextOnFocus
                    editable={!isFollower}
                    maxLength={3}
                    onChangeText={text => this.onChangedText(text, 'MinBSValue')}
                    value={this.state.MinBSValue}
                  />
                </View>
              </View>
            </Item>
          </ListItem>
          <ListItem last style={[commonCss.CommonStyles.listItem, { flexDirection: 'column' }]}>
            <Item>
              <View style={styles.itemViewOuter}>
                <View>
                  <Text>Övre gräns (mmol/l)</Text>
                  <Input
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    selectTextOnFocus
                    editable={!isFollower}
                    maxLength={4}
                    onChangeText={text => this.onChangedText(text, 'MaxBSValue')}
                    value={this.state.MaxBSValue}
                  />
                </View>
              </View>
            </Item>
          </ListItem>
        </List>
      </View>);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container style={commonCss.CommonStyles.container}>
          <Content>
            {this.renderForm()}
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

ChangeUserSettingScreen.defaultProps = {
  app: null,
  settings: null,
  settingsActions: null,
};

ChangeUserSettingScreen.propTypes = {
  app: PropTypes.object,
  settings: PropTypes.object,
  navigator: PropTypes.object.isRequired,
  settingsActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    app: state.app,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    settingsActions: bindActionCreators(settingsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserSettingScreen);
