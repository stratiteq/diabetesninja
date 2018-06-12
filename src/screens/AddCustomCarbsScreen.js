import React from 'react';
import { PropTypes } from 'prop-types';
import { StyleSheet, TextInput, TouchableHighlight, View, Alert, Keyboard } from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as mealActions from '../redux/meal/actions';
import * as commonCss from '../styles/CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 10,
  },
  openCustomCarbsLink: {},
  openCustomCarbsLinkText: {
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  addCustomContainer: {
    flexDirection: 'column',
  },
  customCarbsModal: {
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  customCarbsModalHeader: {
    marginTop: 30,
    marginBottom: 10,
  },
  customCarbsModalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customCarbsModalHeaderDescription: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
});

class AddCustomCarbsScreen extends React.Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    drawUnderNavBar: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      calculatedCarbs: 0,
    };

    this.addCarbsToMeal = this.addCarbsToMeal.bind(this);
    this.safeCalculatedCarbs = this.safeCalculatedCarbs.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.isDoubleTap = this.isDoubleTap.bind(this);
  }

  onChangedText(text) {
    let newText = '';
    const numbers = '0123456789';

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText += text[i];
      }
    }
    this.setState({
      manualCarbEntry: newText,
      calculatedCarbs: this.safeCalculatedCarbs(newText),
    });
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      default:
        break;
    }
  }

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1500) {
      return true;
    }
    this.lastTap = now;
    return false;
  }

  safeCalculatedCarbs(inputCarbs) {
    const numCarbs = parseFloat(inputCarbs);
    if (!Number.isNaN(numCarbs)) {
      return Math.round(numCarbs, 0);
    }
    return 0;
  }

  async addCarbsToMeal() {
    if (this.isDoubleTap()) return;

    Keyboard.dismiss();

    if (Number.isNaN(this.state.safeCalculatedCarbs)) {
      Alert.alert('Var god ange ett numeriskt värde.');
      return;
    }

    if (this.state.safeCalculatedCarbs > 999) {
      Alert.alert('Värdet är för stort. (Maxvärde: 999)');
      return;
    }

    if (this.state.safeCalculatedCarbs < 1) {
      Alert.alert('Värdet är för lågt.');
      return;
    }

    const payload = {
      carbEquivalent: this.state.calculatedCarbs,
      foodGroupId: 13,
      foodGroupName: 'Övrigt',
      foodId: '0',
      imageurl: '',
      isGramMode: true,
      key: this.makeid(),
      name: 'Övrigt',
      qty: this.state.calculatedCarbs,
      qtyUnit: 'Gram',
    };

    this.props.mealActions.addCarbToMeal(payload);

    this.props.navigator.pop();
  }

  makeid() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.customCarbsModalHeaderDescription}>
          Ange kolhydrater för livsmedel du inte hittar i livsmedelsdatabasen.
        </Text>
        <View style={styles.addCustomContainer}>
          <View style={commonCss.CommonStyles.input}>
            <TextInput
              keyboardType="numeric"
              placeholderTextColor="#555555"
              placeholder="Kolhydrater"
              maxLength={3}
              underlineColorAndroid="#00000000"
              textAlign="center"
              value={this.state.manualCarbEntry}
              ref={(input) => {
                this.passwordInput = input;
              }}
              onChangeText={text => this.onChangedText(text)}
              onSubmitEditing={this.addCarbsToMeal}
            />
          </View>
          <View>
            <TouchableHighlight
              style={commonCss.default.buttonView}
              underlayColor="#777"
              onPress={this.addCarbsToMeal}
            >
              <Text style={commonCss.default.buttontext}>Lägg till</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

AddCustomCarbsScreen.defaultProps = {
  mealActions: null,
  navigator: null,
};

AddCustomCarbsScreen.propTypes = {
  mealActions: PropTypes.object,
  navigator: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    food: state.food,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mealActions: bindActionCreators(mealActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AddCustomCarbsScreen,
);
