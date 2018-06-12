import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import { bindActionCreators } from "redux";
import * as userLogActions from "../redux/userlog/actions";
import * as commonCss from "../styles/CommonStyles";
import * as navigatorStyles from "../styles/NavigatorStyles";
import ButtonContainer from "../components/log/ButtonContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFF"
  }
});

class LogNote extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.state = {
      note: ""
    };

    this.logNote = this.logNote.bind(this);
    this.onCancelLog = this.onCancelLog.bind(this);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  logNote() {
    if (!this.state.note) {
      Alert.alert(`Var god ange ett värde.`);
      return;
    }

    this.props.userLogActions.saveNote({
      date: new Date(),
      value: this.state.note
    });

    this.props.navigator.pop();
  }

  onCancelLog() {
    this.props.navigator.pop();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        this.props.navigator.pop();
        break;
      default:
        //console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={commonCss.default.input}
          autoFocus={true}
          multiline={false}
          onChangeText={note => this.setState({ note })}
          value={this.state.note}
          maxLength={200}
          underlineColorAndroid="#00000000"
        />
        <ButtonContainer tapped={this.logNote} text="Logga" onCancel={this.onCancelLog} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    //notes: state.notes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogActions: bindActionCreators(userLogActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogNote);
