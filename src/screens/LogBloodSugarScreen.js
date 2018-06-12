import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import {
  Keyboard,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Text
} from "react-native";
import { bindActionCreators } from "redux";
import * as bloodSugarActions from "../redux/bloodsugar/actions";
import * as navigatorStyles from "../styles/NavigatorStyles";
import * as commonCss from "../styles/CommonStyles";
import * as formatting from "../utils/formatting";
import * as logTypeConst from "../constants/logTypes";
import ButtonContainer from "../components/log/ButtonContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "column"
  },
  input: {
    height: 60,
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center"
  },
  unitLabel: {
    fontSize: 16,
    textAlign: "center"
  }
});

class LogBloodSugar extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.state = {
      chosenNumber: this.getLastBloodSugarValue()
    };

    this.logBloodSugarValue = this.logBloodSugarValue.bind(this);
    this.onCancelLog = this.onCancelLog.bind(this);
    this.isDoubleTap = this.isDoubleTap.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  getLastBloodSugarValue() {
    if (
      !this.props.bloodsugar.lastValue &&
      !this.props.externalUserData.lastExternalValue
    )
      return "0.0";

    if (
      !this.props.externalUserData.lastExternalValue ||
      moment(this.props.bloodsugar.lastValue.date) >
        moment(this.props.externalUserData.lastExternalValue.date)
    ) {
      const { lastValue } = this.props.bloodsugar;

      return formatting.toDecimalString(lastValue.value);
    }

    const lastValue = this.props.externalUserData.lastExternalValue;

    return formatting.toDecimalString(lastValue.value);
  }

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1500) {
      return true;
    }
    this.lastTap = now;
    return false;
  }

  logBloodSugarValue() {
    if (this.isDoubleTap()) return;

   
    const input = this.state.chosenNumber.replace(",", ".");

    let bloodSugarValue = Number.parseFloat(input);

    if (bloodSugarValue > 30) {
      Alert.alert(`Värdet är för stort. (Maxvärde: 30)`);
      return;
    }

    if (bloodSugarValue < 0.1) {
      Alert.alert(`Värdet är för lågt.`);
      return;
    }

    if (Number.isNaN(bloodSugarValue)) {
      Alert.alert(`Var god ange ett värde.`);
      return;
    }

    bloodSugarValue = Math.round(bloodSugarValue * 10) / 10;

    Keyboard.dismiss();
    this.props.bloodSugarActions.saveBloodSugar(
      {
        date: new Date(),
        value: bloodSugarValue
      },
      () => {
        this.props.navigator.pop();
      }
    );
  }

  onCancelLog() {
    Keyboard.dismiss();
    this.props.navigator.pop();
  }

  onChangedText(text) {
    let newText = "";
    const numbers = "0123456789.,";

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText += text[i];
      }
    }
    this.setState({ chosenNumber: newText });
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        Keyboard.dismiss();
        this.props.navigator.pop();
        break;
      default:
      // console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[commonCss.default.input, styles.input]}
          keyboardType="numeric"
          autoFocus={true}
          selectTextOnFocus={true}
          multiline={false}
          onChangeText={text => this.onChangedText(text)}
          value={this.state.chosenNumber}
          maxLength={4}
          underlineColorAndroid="#00000000"
        />
        <Text style={[styles.unitLabel]}>mmol/l</Text>
        <ButtonContainer
          tapped={this.logBloodSugarValue}
          onCancel={this.onCancelLog}
          text="Logga"
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    bloodsugar: state.bloodsugar,
    externalUserData: state.externalUserData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    bloodSugarActions: bindActionCreators(bloodSugarActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogBloodSugar);
