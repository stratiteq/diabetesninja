import React from 'react';
import { PropTypes } from 'prop-types';
import { Alert, AsyncStorage, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Input, Item, Text, View } from 'native-base';
import CalculateInsulinStyle from '../styles/CalculateInsulinStyles';
import * as storageKeys from '../constants/storageKeys';

class CalculateInsulinScreen extends React.Component {
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
      totalUnits: '0',
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  async componentWillMount() {
    const storedTotalUnits = await AsyncStorage.getItem(storageKeys.TOTALUNITS_INSULIN);
    if (storedTotalUnits === null) return;
    this.setState({
      totalUnits: storedTotalUnits,
    });
  }

  async onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      case 'save':
        await this.saveTotalUnits();
        break;
      default:
        break;
    }
  }

  async saveTotalUnits() {
    await AsyncStorage.setItem(
      storageKeys.TOTALUNITS_INSULIN,
      this.state.totalUnits,
    );
    Alert.alert(
      'Sparat',
      'Totalt antal enhteter av insulin är nu sparat på denna devicen.',
      [{ text: 'OK' }],
    );
  }

  calculateGram(rule) {
    if (this.state.totalUnits === undefined) return '0';
    if (this.state.totalUnits === null) return '0';
    if (this.state.totalUnits === '') return '0';
    if (this.state.totalUnits === '0') return '0';

    const quota = rule / parseInt(this.state.totalUnits, 10);
    return Math.round(quota * 10) / 10;
  }

  render() {
    return (
      <Container>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Content style={CalculateInsulinStyle.content}>
            <Text style={CalculateInsulinStyle.infoText}>
              Denna sidan används som hjälp för att beräkna insulin.
              Då en riktig insulinberäkning kräver CE-märkning används denna som ett stöd.
            </Text>
            <Text
              style={CalculateInsulinStyle.infoText}
            >Yngre barn behöver ofta flera olika kvoter under dagen.
            </Text>
            <Text
              style={CalculateInsulinStyle.infoText}
            >Kontakta din läkare för hjälp med kvoterna!
            </Text>
            <View style={CalculateInsulinStyle.section}>
              <View style={CalculateInsulinStyle.inputContainer}>
                <Text
                  style={CalculateInsulinStyle.label}
                >Totalt antal enheter insulin per dygn (basal + bolus)
                </Text>
                <Item
                  regular
                  style={CalculateInsulinStyle.input}
                >
                  <Input
                    style={CalculateInsulinStyle.input}
                    onChangeText={totalUnits => this.setState({ totalUnits })}
                    value={this.state.totalUnits}
                    keyboardType="numeric"
                    maxLength={4}
                    textAlign="center"
                  />
                </Item>
              </View>
            </View>
            <Text
              style={CalculateInsulinStyle.sectionTitle}
            >Kolhydratberäkning (Kolhydratkvot)
            </Text>
            <View style={CalculateInsulinStyle.section}>
              <View style={CalculateInsulinStyle.ruleContainer}>
                <Text
                  style={CalculateInsulinStyle.ruleLabel}
                >300-regeln (Används till frukost)
                </Text>
                <Text
                  style={CalculateInsulinStyle.ruleValue}
                >300 / {this.state.totalUnits} = {this.calculateGram(300)} g KH*
                </Text>
              </View>
              <View style={CalculateInsulinStyle.ruleContainer}>
                <Text
                  style={CalculateInsulinStyle.ruleLabel}
                >500-regeln (Används för resten av dagen)
                </Text>
                <Text
                  style={CalculateInsulinStyle.ruleValue}
                >500 / {this.state.totalUnits} = {this.calculateGram(500)} g KH*
                </Text>
              </View>
              <Text
                style={CalculateInsulinStyle.sectionHelp}
              >* Det antal gram kolhydrater som 1 enhet insulin tar hand om.
              </Text>
            </View>
            <Text style={CalculateInsulinStyle.sectionTitle}>Korrigeringsdos (Insulinkvot)</Text>
            <View style={[CalculateInsulinStyle.section, { marginBottom: 100 }]}>
              <Text style={CalculateInsulinStyle.sectionDescription}>
                Om ditt blodsocker är över 8 mmol/l när det gått mer än två timmar efter måltid -
                överväg att ge en korrigeringsdos!
              </Text>
              <View style={CalculateInsulinStyle.ruleContainer}>
                <Text
                  style={CalculateInsulinStyle.ruleLabel}
                >100-regeln (Används på dagen)
                </Text>
                <Text
                  style={CalculateInsulinStyle.ruleValue}
                >100 / {this.state.totalUnits} = {this.calculateGram(100)} mmol/l*
                </Text>
              </View>
              <View style={CalculateInsulinStyle.ruleContainer}>
                <Text
                  style={CalculateInsulinStyle.ruleLabel}
                >200-regeln (Används på natten)
                </Text>
                <Text
                  style={CalculateInsulinStyle.ruleValue}
                >200 / {this.state.totalUnits} = {this.calculateGram(200)} mmol/l*
                </Text>
              </View>
              <Text
                style={CalculateInsulinStyle.sectionHelp}
              >* Det antal mmol/l (=steg) som ditt blodsocker sänks utav 1 enhet insulin.
              </Text>
            </View>
          </Content>
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}

CalculateInsulinScreen.defaultProps = {
};

CalculateInsulinScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default CalculateInsulinScreen;
